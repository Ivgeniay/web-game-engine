import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  type MenuBarChild,
} from "@proton/ui";
import { useMenuStore } from "../../store/menu_store";

function renderChildren(children: MenuBarChild[]) {
  return children.map((child) => {
    if (child.separator) {
      return <DropdownMenuSeparator key={child.id} />;
    }
    if (child.children && child.children.length > 0) {
      return (
        <DropdownMenuSub
          key={child.id}
          label={child.label}
          disabled={child.disabled}
        >
          {renderChildren(child.children)}
        </DropdownMenuSub>
      );
    }
    return (
      <DropdownMenuItem
        key={child.id}
        label={child.label}
        shortcut={child.shortcut}
        disabled={child.disabled}
        onClick={child.onClick}
      />
    );
  });
}

export function Header() {
  const registry = useMenuStore((state) => state.registries["editor.header"]);

  if (!registry) return null;

  return (
    <header className="flex items-center h-8 bg-secondary border-b border-default">
      {registry.items.map((item) => (
        <DropdownMenu
          key={item.id}
          trigger={
            <div className="px-3 py-1 text-sm text-primary hover:bg-hover transition-colors cursor-pointer select-none">
              {item.label}
            </div>
          }
        >
          {item.children && renderChildren(item.children)}
        </DropdownMenu>
      ))}
    </header>
  );
}
