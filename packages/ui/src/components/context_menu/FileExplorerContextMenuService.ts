import type { TreeItem } from "../icons/types";
import { MergeMode, type ContextMenuItem } from "./types";

let DEFAULT_ITEMS: ContextMenuItem[] = [];

class FileExplorerContextMenuServiceClass {
  private registered: ContextMenuItem[] = [];
  private mergeMode: MergeMode = MergeMode.Separator;

  register(
    items: ContextMenuItem[],
    mode: MergeMode = MergeMode.Separator,
  ): void {
    this.registered = items;
    this.mergeMode = mode;
  }

  registerDefault(menu_items: ContextMenuItem[]) {
    DEFAULT_ITEMS = menu_items;
  }

  getItems(treeItem: TreeItem): ContextMenuItem[] {
    if (this.registered.length === 0) return DEFAULT_ITEMS;

    if (this.mergeMode === MergeMode.Separator) {
      return [
        ...DEFAULT_ITEMS,
        { id: "sep_registered", separator: true, label: "" },
        ...this.registered,
      ];
    }

    if (this.mergeMode === MergeMode.Override) {
      const overrideMap = new Map(this.registered.map((i) => [i.id, i]));
      const merged = DEFAULT_ITEMS.map(
        (item) => overrideMap.get(item.id) ?? item,
      );
      const newItems = this.registered.filter(
        (i) => !DEFAULT_ITEMS.some((d) => d.id === i.id),
      );
      return [...merged, ...newItems];
    }

    return DEFAULT_ITEMS;
  }
}

export const FileExplorerContextMenuService =
  new FileExplorerContextMenuServiceClass();
