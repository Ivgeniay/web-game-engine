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
  editingId?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  onContextMenu?: (item: TreeItem, e: React.MouseEvent) => void;
  onRenameConfirm?: (item: TreeItem, value: string) => void;
  onRenameCancel?: () => void;
  getDropProps?: (item: TreeItem) => IDrop;
}

function TreeNode({
  item,
  icon,
  size = 16,
  depth = 0,
  selected,
  editingId,
  canDrag = false,
  onSelect,
  onOpen,
  onExpand,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
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
            editing={editingId === item.id}
            canDrag={canDrag}
            dragMeta={item.dragMeta}
            onClick={() => onSelect?.(item.id)}
            onDoubleClick={() => isDirectory && handleToggle()}
            onContextMenu={(e) => onContextMenu?.(item, e)}
            onRenameConfirm={(value) => onRenameConfirm?.(item, value)}
            onRenameCancel={onRenameCancel}
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
  editingId?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: TreeItem) => void;
  onExpand?: (id: string) => void;
  onContextMenu?: (item: TreeItem, e: React.MouseEvent) => void;
  onRenameConfirm?: (item: TreeItem, value: string) => void;
  onRenameCancel?: () => void;
  getDropProps?: (item: TreeItem) => IDrop;
}

export function TreeView({
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
      ))}
    </div>
  );
}
