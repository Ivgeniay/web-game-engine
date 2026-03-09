import type { IconProps, TreeItem } from "./types";
import type { IDraggable, IDrop } from "../dnd/types";
import { TreeView } from "./TreeView";

interface IconRowSpaceProps extends IDraggable {
  items: TreeItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  sortFn?: (a: TreeItem, b: TreeItem) => number;
  getDropProps?: (item: TreeItem) => IDrop;
}

export function IconRowSpace({
  items,
  icon,
  size = 16,
  selected,
  isDragOver,
  canDrag = false,
  onSelect,
  onOpen,
  onExpand,
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
      isDragOver={isDragOver}
      canDrag={canDrag}
      onSelect={onSelect}
      onOpen={onOpen}
      onExpand={onExpand}
      getDropProps={getDropProps}
    />
  );
}
