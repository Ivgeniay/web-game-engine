import type { IconProps, TreeItem } from "./types";
import type { IDraggable, IDrop } from "../dnd/types";
import { TreeView } from "./TreeView";

interface IconRowSpaceProps extends IDraggable {
  items: TreeItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  selected?: string[];
  editingId?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  onContextMenu?: (item: TreeItem, e: React.MouseEvent) => void;
  onRenameConfirm?: (item: TreeItem, value: string) => void;
  onRenameCancel?: () => void;
  sortFn?: (a: TreeItem, b: TreeItem) => number;
  getDropProps?: (item: TreeItem) => IDrop;
}

export function IconRowSpace({
  items,
  icon,
  size = 16,
  selected,
  editingId,
  canDrag = false,
  onSelect,
  onOpen,
  onExpand,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
  sortFn,
  getDropProps,
}: IconRowSpaceProps): React.ReactElement {
  const sorted = sortFn ? [...items].sort(sortFn) : items;

  return (
    <TreeView
      items={sorted}
      icon={icon}
      size={size}
      selected={selected}
      editingId={editingId}
      canDrag={canDrag}
      onSelect={onSelect}
      onOpen={onOpen}
      onExpand={onExpand}
      onContextMenu={onContextMenu}
      onRenameConfirm={onRenameConfirm}
      onRenameCancel={onRenameCancel}
      getDropProps={getDropProps}
    />
  );
}
