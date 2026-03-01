import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

interface DropdownMenuItemProps {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function DropdownMenuItem({
  label,
  shortcut,
  disabled,
  onClick,
}: DropdownMenuItemProps) {
  return (
    <RadixDropdown.Item
      className="flex items-center justify-between px-3 py-1 text-sm text-primary cursor-pointer outline-none hover:bg-hover disabled:text-disabled"
      disabled={disabled}
      onClick={onClick}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="text-secondary ml-8 text-xs">{shortcut}</span>
      )}
    </RadixDropdown.Item>
  );
}
