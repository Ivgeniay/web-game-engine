import type { IconProps, TreeItem } from "./types";
import { TreeView } from "./TreeView";

interface IconRowSpaceProps {
  items: TreeItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  sortFn?: (a: TreeItem, b: TreeItem) => number;
}

export function IconRowSpace({
  items,
  icon,
  size = 16,
  selected,
  isDragOver,
  onSelect,
  onOpen,
  sortFn,
}: IconRowSpaceProps): React.ReactNode {
  const sorted = sortFn ? [...items].sort(sortFn) : items;

  return (
    <TreeView
      items={sorted}
      icon={icon}
      size={size}
      selected={selected}
      isDragOver={isDragOver}
      onSelect={onSelect}
      onOpen={onOpen}
    />
  );
}
