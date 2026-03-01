import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

interface DropdownMenuSubProps {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function DropdownMenuSub({
  label,
  children,
  disabled,
}: DropdownMenuSubProps) {
  return (
    <RadixDropdown.Sub>
      <RadixDropdown.SubTrigger
        className="flex items-center justify-between px-3 py-1 text-sm text-primary cursor-pointer outline-none hover:bg-hover disabled:text-disabled w-full"
        disabled={disabled}
      >
        <span>{label}</span>
        <span className="text-secondary ml-8 text-xs">▶</span>
      </RadixDropdown.SubTrigger>
      <RadixDropdown.Portal>
        <RadixDropdown.SubContent
          className="min-w-48 bg-secondary border border-default rounded py-1 shadow-lg z-50"
          sideOffset={2}
        >
          {children}
        </RadixDropdown.SubContent>
      </RadixDropdown.Portal>
    </RadixDropdown.Sub>
  );
}
