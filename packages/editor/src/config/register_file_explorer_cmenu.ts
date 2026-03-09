import { FileExplorerContextMenuService } from "@proton/ui";
import { useProjectStore } from "../store/project_store";
import { filesApi } from "../api/files";
import { Debug } from "@proton/engine";
import { useEditorStore } from "../store/editor_store";

const getProjectId = () => useProjectStore.getState().activeProject?.id;

export function registerFileExplorerMenu(): void {
  FileExplorerContextMenuService.registerDefault([
    {
      id: "new_folder",
      label: "New Folder",
      action: async (item) => {
        const projectId = getProjectId();
        if (!projectId) return;
        const base =
          item.ext === "directory"
            ? item.id
            : item.id.split(/[\\/]/).slice(0, -1).join("/");
        const path = base ? `${base}/New Folder` : "New Folder";
        console.log(`${path}`);
        await filesApi.createDirectory(projectId, { path });
      },
    },
    {
      id: "new_file",
      label: "New File",
      action: async (item) => {
        const projectId = getProjectId();
        if (!projectId) return;
        const base =
          item.ext === "directory"
            ? item.id
            : item.id.split(/[\\/]/).slice(0, -1).join("/");
        const path = base ? `${base}/New File.txt` : "New File.txt";
        await filesApi.createFile(projectId, { path });
      },
    },
    {
      id: "sep_1",
      separator: true,
      label: "",
    },
    {
      id: "rename",
      label: "Rename",
      disabled: (item) => item.id === "",
      action: (item) => {
        useEditorStore.getState().setEditingId(item.id);
      },
    },
    {
      id: "delete",
      label: "Delete",
      disabled: (item) => item.id === "",
      action: async (item) => {
        const projectId = getProjectId();
        if (!projectId) return;
        if (item.ext === "directory") {
          await filesApi.deleteDirectory(projectId, item.id);
        } else {
          await filesApi.deleteFile(projectId, item.id);
        }
      },
    },
    {
      id: "sep_2",
      separator: true,
      label: "",
    },
    {
      id: "copy",
      label: "Copy",
      disabled: (item) => item.id === "",
      action: (item) => {
        console.log("copy", item.id);
      },
    },
    {
      id: "paste",
      label: "Paste",
      disabled: () => true,
      action: () => {
        console.log("paste");
      },
    },
    {
      id: "duplicate",
      label: "Duplicate",
      disabled: (item) => item.id === "",
      action: (item) => {
        console.log("duplicate", item.id);
      },
    },
  ]);
}
