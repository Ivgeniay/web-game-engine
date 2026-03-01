import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function DropdownMenu(props: DropdownMenuProps) {
  let trigger = props.trigger;
  let children = props.children;

  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          className="min-w-48 bg-secondary border border-default rounded py-1 shadow-lg z-50"
          sideOffset={2}
        >
          {children}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
