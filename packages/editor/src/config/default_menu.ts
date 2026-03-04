import type { MenuBarRegistry } from "@proton/ui";

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
        { id: "file.exit", label: "Exit" },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      children: [
        { id: "edit.undo", label: "Undo", shortcut: "Ctrl+Z" },
        { id: "edit.redo", label: "Redo", shortcut: "Ctrl+Y" },
        { id: "edit.sep1", label: "", separator: true },
        { id: "edit.preferences", label: "Preferences" },
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
        { id: "window.scene", label: "Scene" },
        { id: "window.hierarchy", label: "Hierarchy" },
        { id: "window.inspector", label: "Inspector" },
        { id: "window.console", label: "Console" },
        { id: "window.filesystem", label: "File System" },
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
