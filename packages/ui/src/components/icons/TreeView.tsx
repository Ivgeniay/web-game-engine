import { useState } from "react";
import type { IconProps, TreeItem } from "./types";
import type { IDraggable, IDrop } from "../dnd/types";
import { IconRow } from "./IconRow";
import { ChevronIcon } from "./ChevronIcon";

interface TreeNodeProps extends IDraggable {
  item: TreeItem;
  icon: React.ComponentType<IconProps>;
  size?: number;
  depth?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  getDropProps?: (item: TreeItem) => IDrop;
}

function TreeNode({
  item,
  icon,
  size = 16,
  depth = 0,
  selected,
  isDragOver,
  canDrag = false,
  onSelect,
  onOpen,
  onExpand,
  getDropProps,
}: TreeNodeProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isDirectory = item.ext === "directory";

  const handleToggle = () => {
    if (!isDirectory) return;
    const next = !expanded;
    setExpanded(next);
    if (next && !hasChildren) onExpand?.(item.id);
  };

  const dropProps = getDropProps?.(item) ?? {};

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex items-center gap-1 w-full"
        style={{ paddingLeft: depth * 12 }}
      >
        <span
          className="shrink-0 w-4 select-none cursor-pointer"
          onClick={handleToggle}
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
            canDrag={canDrag}
            dragMeta={item.dragMeta}
            onClick={() => onSelect?.(item.id)}
            onDoubleClick={() => isDirectory && handleToggle()}
            {...dropProps}
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
              canDrag={canDrag}
              onSelect={onSelect}
              onOpen={onOpen}
              onExpand={onExpand}
              getDropProps={getDropProps}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps extends IDraggable {
  items: TreeItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  selected?: string[];
  isDragOver?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  getDropProps?: (item: TreeItem) => IDrop;
}

export function TreeView({
  items,
  icon,
  size = 16,
  selected,
  isDragOver,
  canDrag = false,
  onSelect,
  onOpen,
  onExpand,
  getDropProps,
}: TreeViewProps): React.ReactElement {
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
          canDrag={canDrag}
          onSelect={onSelect}
          onOpen={onOpen}
          onExpand={onExpand}
          getDropProps={getDropProps}
        />
      ))}
    </div>
  );
}
