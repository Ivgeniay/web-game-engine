import { useState } from "react";
import {
  FileIcon,
  IconRowSpace,
  IconTileSpace,
  ContextMenu,
  FileExplorerContextMenuService,
} from "@proton/ui";
import type { IconSpaceItem, TreeItem, IDrop } from "@proton/ui";
import { useFileExplorer } from "../../../hooks/useFileExplorer";
import { useProjectStore } from "../../../store/project_store";
import { useEditorStore } from "../../../store/editor_store";
import { filesApi } from "../../../api/files";

const DIRECTORY_DROP_ACCEPTS = {
  file_explorer: "file_explorer",
};

interface ContextMenuState {
  item: TreeItem;
  x: number;
  y: number;
}

function Breadcrumb({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: (p: string) => void;
}): React.ReactElement {
  const parts = path.split(/[\\/]/).filter(Boolean);

  return (
    <div className="flex items-center gap-1 text-xs text-secondary overflow-x-auto shrink-0">
      <span
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => onNavigate("")}
      >
        Assets
      </span>
      {parts.map((part, i) => {
        const partPath = parts.slice(0, i + 1).join("/");
        return (
          <span key={partPath} className="flex items-center gap-1">
            <span className="text-disabled">/</span>
            <span
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => onNavigate(partPath)}
            >
              {part}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function FileExplorerPanel(): React.ReactElement {
  const {
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
    reload,
  } = useFileExplorer();

  const projectId = useProjectStore((s) => s.activeProject?.id);
  const editingId = useEditorStore((s) => s.editingId);
  const setEditingId = useEditorStore((s) => s.setEditingId);
  //const dragMeta = useEditorStore((s) => s.dragMeta);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleDrop = async (
    source: ReturnType<typeof useEditorStore.getState>["dragMeta"],
    targetPath: string,
  ) => {
    if (!source || !projectId) return;
    const isDir = !!source.directory;
    const sourcePath = source.file ?? source.directory;
    if (!sourcePath) return;
    const fileName = sourcePath.split(/[\\/]/).pop()!;
    const toPath = targetPath ? `${targetPath}/${fileName}` : fileName;
    try {
      if (isDir) {
        await filesApi.moveDirectory(projectId, {
          fromPath: sourcePath,
          toPath,
        });
      } else {
        await filesApi.moveFile(projectId, { fromPath: sourcePath, toPath });
      }
      reload();
    } catch {
      // silently ignore
    }
  };

  const handleNativeDrop = async (files: FileList, targetPath: string) => {
    if (!projectId) return;
    const uploads = Array.from(files).map((file) => {
      const uploadPath = targetPath ? `${targetPath}/${file.name}` : file.name;
      return filesApi.uploadFile(projectId, uploadPath, file);
    });
    try {
      await Promise.all(uploads);
      reload();
    } catch {
      // silently ignore
    }
  };

  const handleRenameConfirm = async (item: TreeItem, newName: string) => {
    setEditingId(null);
    if (!projectId || newName === item.label) return;
    try {
      if (item.ext === "directory") {
        await filesApi.renameDirectory(projectId, { path: item.id, newName });
      } else {
        await filesApi.renameFile(projectId, { path: item.id, newName });
      }
      reload();
    } catch {
      // silently ignore
    }
  };

  const handleContextMenu = (item: TreeItem, e: React.MouseEvent) => {
    setContextMenu({ item, x: e.clientX, y: e.clientY });
  };

  const getTileDropProps = (item: IconSpaceItem): IDrop => {
    if (item.ext !== "directory") return {};
    return {
      accepts: DIRECTORY_DROP_ACCEPTS,
      onDrop: (source) => handleDrop(source, item.id),
      onNativeDrop: (files) => handleNativeDrop(files, item.id),
    };
  };

  const getTreeDropProps = (item: TreeItem): IDrop => {
    if (item.ext !== "directory") return {};
    return {
      accepts: DIRECTORY_DROP_ACCEPTS,
      onDrop: (source) => handleDrop(source, item.id),
      onNativeDrop: (files) => handleNativeDrop(files, item.id),
    };
  };

  const handleTileOpen = (item: IconSpaceItem) => {
    if (item.ext === "directory") navigateTo(item.id);
  };

  const rootTreeItems: TreeItem[] = [
    {
      id: "",
      label: "Assets",
      ext: "directory",
      dragMeta: undefined,
      children: treeItems,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-panel overflow-hidden">
      <div className="flex items-center gap-2 px-2 py-1 border-b border-border shrink-0">
        <button
          className="text-secondary hover:text-primary transition-colors text-xs px-1 disabled:opacity-40"
          onClick={navigateUp}
          disabled={!currentPath}
        >
          ↑
        </button>
        <Breadcrumb path={currentPath} onNavigate={navigateTo} />
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <button
            className={[
              "text-xs px-1.5 py-0.5 rounded transition-colors",
              viewMode === "tree"
                ? "bg-accent text-white"
                : "text-secondary hover:text-primary",
            ].join(" ")}
            onClick={() => setViewMode("tree")}
          >
            ☰
          </button>
          <button
            className={[
              "text-xs px-1.5 py-0.5 rounded transition-colors",
              viewMode === "tile"
                ? "bg-accent text-white"
                : "text-secondary hover:text-primary",
            ].join(" ")}
            onClick={() => setViewMode("tile")}
          >
            ⊞
          </button>
          {viewMode === "tile" && (
            <input
              type="range"
              min={32}
              max={128}
              value={tileSize}
              onChange={(e) => setTileSize(Number(e.target.value))}
              className="w-20"
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-1">
        {loading && (
          <div className="flex items-center justify-center w-full h-full text-secondary text-xs">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center w-full h-full text-error text-xs">
            {error}
          </div>
        )}
        {!loading && !error && viewMode === "tree" && (
          <IconRowSpace
            items={rootTreeItems}
            icon={FileIcon}
            size={16}
            selected={selectedIds}
            editingId={editingId ?? undefined}
            canDrag
            onSelect={select}
            onExpand={expandNode}
            onContextMenu={handleContextMenu}
            onRenameConfirm={handleRenameConfirm}
            onRenameCancel={() => setEditingId(null)}
            getDropProps={getTreeDropProps}
          />
        )}
        {!loading && !error && viewMode === "tile" && (
          <IconTileSpace
            items={spaceItems}
            icon={FileIcon}
            size={tileSize}
            gap={8}
            selected={selectedIds}
            editingId={editingId ?? undefined}
            canDrag
            onSelect={select}
            onOpen={handleTileOpen}
            onContextMenu={handleContextMenu}
            onRenameConfirm={(item, value) =>
              handleRenameConfirm(item as unknown as TreeItem, value)
            }
            onRenameCancel={() => setEditingId(null)}
            getDropProps={getTileDropProps}
          />
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          items={FileExplorerContextMenuService.getItems(contextMenu.item)}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          treeItem={contextMenu.item}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
