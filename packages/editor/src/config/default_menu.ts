import { Debug } from "@proton/engine";
import type { MenuBarRegistry } from "@proton/ui";
import { useUserStore } from "../store/user_store";
import { EditorLayoutService } from "../services/EditorLayoutService";
import { SettingsPanel } from "../ui/panels/settings_panel/SettingsPanel";
import { useProjectStore } from "../store/project_store";
import { WsService } from "../services/WsService";
import { useDebugStore } from "../store/debug_store";
import { FileExplorerPanel } from "../ui/panels/file_explorer_panel/FileExplorerPanel";
import { ConsolePanel } from "../ui/panels/console_panel/ConsolePanel";
import { InspectorPanel } from "../ui/panels/inspector_panel/InspectorPanel";
import { HierarchyPanel } from "../ui/panels/hierarchy_panel/HierarchyPanel";
import { ScenePanel } from "../ui/panels/scene_panel/ScenePanel";

interface defaultWindowCoef {
  HierarchyWidth: number;
  HierarchyHeight: number;
  SceneWidth: number;
  SceneHeight: number;
  InspectorWidth: number;
  InspectorHeight: number;
  ConsoleWight: number;
  ConsoleHeight: number;
}

export const defaultWindowCoef: defaultWindowCoef = {
  HierarchyWidth: 0.15,
  HierarchyHeight: 0.7,
  SceneWidth: 0.7,
  SceneHeight: 0.7,
  InspectorWidth: 0.15,
  InspectorHeight: 0.7,
  ConsoleWight: 1,
  ConsoleHeight: 0.3,
};

export const defaultEditorMenu: MenuBarRegistry = {
  id: "editor.header",
  items: [
    {
      id: "file",
      label: "File",
      children: [
        { id: "file.new", label: "New Project", shortcut: "Ctrl+N" },
        { id: "file.open", label: "Open Project", shortcut: "Ctrl+O" },
        { id: "file.sep1", label: "", separator: true },
        { id: "file.save", label: "Save", shortcut: "Ctrl+S" },
        { id: "file.saveas", label: "Save As...", shortcut: "Ctrl+Shift+S" },
        { id: "file.sep2", label: "", separator: true },
        {
          id: "file.exit",
          label: "Exit",
          onClick: () => {
            useDebugStore.getState().clearMessages();
            useUserStore.getState().clearUser();
            useProjectStore.getState().clearProject();
          },
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      children: [
        { id: "edit.undo", label: "Undo", shortcut: "Ctrl+Z" },
        { id: "edit.redo", label: "Redo", shortcut: "Ctrl+Y" },
        { id: "edit.sep1", label: "", separator: true },
        {
          id: "edit.preferences",
          label: "Preferences",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "settings",
              title: "Preferences",
              component: SettingsPanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
      ],
    },
    {
      id: "assets",
      label: "Assets",
      children: [
        { id: "assets.import", label: "Import Asset..." },
        { id: "assets.sep1", label: "", separator: true },
        {
          id: "assets.create",
          label: "Create",
          children: [
            { id: "assets.create.folder", label: "Folder" },
            { id: "assets.create.script", label: "Script" },
            { id: "assets.create.material", label: "Material" },
          ],
        },
      ],
    },
    {
      id: "window",
      label: "Window",
      children: [
        {
          id: "window.scene",
          label: "Scene",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "scene",
              title: "Scene",
              component: ScenePanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
        {
          id: "window.hierarchy",
          label: "Hierarchy",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "hierarchy",
              title: "Hierarchy",
              component: HierarchyPanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
        {
          id: "window.inspector",
          label: "Inspector",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "inspector",
              title: "Inspector",
              component: InspectorPanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
        {
          id: "window.console",
          label: "Console",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "console",
              title: "Console",
              component: ConsolePanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
        {
          id: "window.filesystem",
          label: "File System",
          onClick: () => {
            EditorLayoutService.openPanel({
              id: "fileexplorer",
              title: "FileExplorer",
              component: FileExplorerPanel,
              floating: true,
              initialWidth: 600,
              initialHeight: 400,
            });
          },
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      children: [
        { id: "help.docs", label: "Documentation" },
        { id: "help.about", label: "About Proton" },
      ],
    },
  ],
};
