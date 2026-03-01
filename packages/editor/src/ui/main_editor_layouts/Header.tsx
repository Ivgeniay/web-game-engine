import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from "@proton/ui";

function MenuButton({ label }: { label: string }) {
  return (
    <div
      className="px-3 py-1 text-sm text-primary hover:bg-hover transition-colors cursor-pointer select-none"
      //onClick={() => console.log("clicked", label)}
    >
      {label}
    </div>
  );
}

export function Header() {
  return (
    <header className="flex items-center h-8 bg-secondary border-b border-default">
      <DropdownMenu trigger={<MenuButton label="File" />}>
        <DropdownMenuItem label="New Project" shortcut="Ctrl+N" />
        <DropdownMenuItem label="Open Project" shortcut="Ctrl+O" />
        <DropdownMenuSeparator />
        <DropdownMenuItem label="Save" shortcut="Ctrl+S" />
        <DropdownMenuItem label="Save As..." shortcut="Ctrl+Shift+S" />
        <DropdownMenuSeparator />
        <DropdownMenuItem label="Exit" />
      </DropdownMenu>

      <DropdownMenu trigger={<MenuButton label="Edit" />}>
        <DropdownMenuItem label="Undo" shortcut="Ctrl+Z" />
        <DropdownMenuItem label="Redo" shortcut="Ctrl+Y" />
        <DropdownMenuSeparator />
        <DropdownMenuItem label="Preferences" />
      </DropdownMenu>

      <DropdownMenu trigger={<MenuButton label="Assets" />}>
        <DropdownMenuItem label="Import Asset..." />
        <DropdownMenuSeparator />
        <DropdownMenuSub label="Create">
          <DropdownMenuItem label="Folder" />
          <DropdownMenuItem label="Script" />
          <DropdownMenuItem label="Material" />
        </DropdownMenuSub>
      </DropdownMenu>

      <DropdownMenu trigger={<MenuButton label="Window" />}>
        <DropdownMenuItem label="Scene" />
        <DropdownMenuItem label="Hierarchy" />
        <DropdownMenuItem label="Inspector" />
        <DropdownMenuItem label="Console" />
        <DropdownMenuItem label="File System" />
      </DropdownMenu>

      <DropdownMenu trigger={<MenuButton label="Help" />}>
        <DropdownMenuItem label="Documentation" />
        <DropdownMenuItem label="About Proton" />
      </DropdownMenu>
    </header>
  );
}
