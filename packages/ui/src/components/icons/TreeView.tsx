import { useState } from "react";
import type { IconProps, TreeItem } from "./types";
import { IconRow } from "./IconRow";
import { ChevronIcon } from "./ChevronIcon";

interface TreeNodeProps {
  item: TreeItem;
  icon: React.ComponentType<IconProps>;
  size?: number;
  depth?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
}

function TreeNode({
  item,
  icon,
  size = 16,
  depth = 0,
  selected,
  isDragOver,
  onSelect,
  onOpen,
}: TreeNodeProps): React.ReactNode {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isDirectory = item.ext === "directory" || hasChildren;

  const handleClick = () => {
    if (isDirectory) setExpanded((prev) => !prev);
    onSelect?.(item.id);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex items-center gap-1 w-full"
        style={{ paddingLeft: depth * 12 }}
      >
        <span
          className="shrink-0 w-4 select-none cursor-pointer"
          onClick={() => isDirectory && setExpanded((prev) => !prev)}
        >
          {isDirectory ? (
            <ChevronIcon ext={expanded ? "open" : "close"} size={size} />
          ) : (
            ""
          )}
        </span>
        <div className="flex-1 min-w-0">
          <IconRow
            icon={icon}
            label={item.label}
            ext={item.ext}
            size={size}
            selected={selected?.includes(item.id)}
            isDragOver={isDragOver === item.id}
            onClick={handleClick}
            onDoubleClick={() => onOpen?.(item)}
          />
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="flex flex-col w-full">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              icon={icon}
              size={size}
              depth={depth + 1}
              selected={selected}
              isDragOver={isDragOver}
              onSelect={onSelect}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps {
  items: TreeItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
}

export function TreeView({
  items,
  icon,
  size = 16,
  selected,
  isDragOver,
  onSelect,
  onOpen,
}: TreeViewProps): React.ReactNode {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          icon={icon}
          size={size}
          selected={selected}
          isDragOver={isDragOver}
          onSelect={onSelect}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
