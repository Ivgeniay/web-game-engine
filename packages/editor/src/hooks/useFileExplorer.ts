import { useCallback, useEffect, useState } from "react";
import type { FileNode } from "@proton/shared";
import { WsEventName } from "@proton/shared";
import type { IconSpaceItem, TreeItem } from "@proton/ui";
import { filesApi } from "../api/files";
import { useProjectStore } from "../store/project_store";
import { WsService } from "../services/WsService";
import { Input } from "@proton/engine";

export type ViewMode = "tile" | "tree";

function fileNodeToTreeItem(node: FileNode): TreeItem {
  const isDirectory = node.type === "directory";
  return {
    id: node.path,
    label: node.name,
    ext: isDirectory ? "directory" : (node.ext ?? ""),
    dragMeta: {
      file_explorer: "file_explorer",
      ...(isDirectory ? { directory: "directory" } : { file: `${node.path}` }),
      ...(!isDirectory && node.ext ? { ext: node.ext } : {}),
    },
    children: isDirectory ? [] : undefined,
  };
}

function fileNodeToSpaceItem(node: FileNode): IconSpaceItem {
  const isDirectory = node.type === "directory";
  return {
    id: node.path,
    label: node.name,
    ext: isDirectory ? "directory" : (node.ext ?? ""),
    dragMeta: {
      file_explorer: "file_explorer",
      ...(isDirectory ? { directory: "directory" } : { file: "file" }),
      ...(!isDirectory && node.ext ? { ext: node.ext } : {}),
    },
  };
}

function insertChildren(
  items: TreeItem[],
  parentId: string,
  children: TreeItem[],
): TreeItem[] {
  return items.map((item) => {
    if (item.id === parentId) return { ...item, children };
    if (item.children)
      return {
        ...item,
        children: insertChildren(item.children, parentId, children),
      };
    return item;
  });
}

export function useFileExplorer() {
  const projectId = useProjectStore((s) => s.activeProject?.id);

  const [currentPath, setCurrentPath] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [tileSize, setTileSize] = useState(64);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [treeItems, setTreeItems] = useState<TreeItem[]>([]);
  const [spaceItems, setSpaceItems] = useState<IconSpaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDirectory = useCallback(
    async (path: string) => {
      if (!projectId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await filesApi.listAssets(projectId, path, {
          recursive: false,
        });
        const dirs = result.nodes.filter((n) => n.type === "directory");
        const files = result.nodes.filter((n) => n.type === "file");
        const sorted = [...dirs, ...files];
        setSpaceItems(sorted.map(fileNodeToSpaceItem));
        setTreeItems(sorted.map(fileNodeToTreeItem));
        setCurrentPath(path);
        setSelectedIds([]);
      } catch {
        setError("Failed to load directory");
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  const expandNode = useCallback(
    async (nodeId: string) => {
      if (!projectId) return;
      try {
        const result = await filesApi.listAssets(projectId, nodeId, {
          recursive: false,
        });
        const dirs = result.nodes.filter((n) => n.type === "directory");
        const files = result.nodes.filter((n) => n.type === "file");
        const sorted = [...dirs, ...files];
        const children = sorted.map(fileNodeToTreeItem);
        setTreeItems((prev) => insertChildren(prev, nodeId, children));
      } catch {
        // silently ignore
      }
    },
    [projectId],
  );

  useEffect(() => {
    loadDirectory("");
  }, [loadDirectory]);

  useEffect(() => {
    const reload = () => loadDirectory(currentPath);

    const unsubs = [
      WsService.on(WsEventName.fsFileCreated, reload),
      WsService.on(WsEventName.fsFileDeleted, reload),
      WsService.on(WsEventName.fsFileMoved, reload),
      WsService.on(WsEventName.fsFileRenamed, reload),
      WsService.on(WsEventName.fsFileOverwritten, reload),
      WsService.on(WsEventName.fsDirCreated, reload),
      WsService.on(WsEventName.fsDirDeleted, reload),
      WsService.on(WsEventName.fsDirMoved, reload),
      WsService.on(WsEventName.fsDirRenamed, reload),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [currentPath, loadDirectory]);

  const navigateTo = (path: string) => loadDirectory(path);

  const navigateUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    loadDirectory(parts.join("/"));
  };

  const select = (id: string, multi = Input.isCtrl()) => {
    setSelectedIds((prev) =>
      multi
        ? prev.includes(id)
          ? prev.filter((s) => s !== id)
          : [...prev, id]
        : [id],
    );
  };

  return {
    currentPath,
    viewMode,
    setViewMode,
    tileSize,
    setTileSize,
    selectedIds,
    treeItems,
    spaceItems,
    loading,
    error,
    navigateTo,
    navigateUp,
    select,
    expandNode,
    reload: () => loadDirectory(currentPath),
  };
}
