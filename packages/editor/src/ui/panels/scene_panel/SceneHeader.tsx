import { DropdownMenu, DropdownMenuItem } from "@proton/ui";

export function SceneHeader() {
  return (
    <div className="flex items-center h-7 bg-secondary border-b border-default px-2">
      <DropdownMenu
        trigger={
          <div className="px-2 py-0.5 text-xs text-primary hover:bg-hover transition-colors cursor-pointer select-none rounded">
            Mock Menu
          </div>
        }
      >
        <DropdownMenuItem
          label="Mock Btn"
          onClick={() => console.log("Mock Btn clicked")}
        />
      </DropdownMenu>
    </div>
  );
}
