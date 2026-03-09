import type { IconProps } from "./types";
import type { IDraggable, IDrop, DragMeta } from "../dnd/types";
import { IconTile } from "./IconTile";

export interface IconSpaceItem extends IconProps {
  id: string;
  label: string;
  dragMeta?: DragMeta;
}

interface IconTileSpaceProps extends IDraggable {
  items: IconSpaceItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  gap?: number;
  selected?: string[];
  isDragOver?: boolean;
  editingId?: string;
  onSelect?: (id: string) => void;
  onOpen?: (item: IconSpaceItem) => void;
  onContextMenu?: (item: IconSpaceItem, e: React.MouseEvent) => void;
  onRenameConfirm?: (item: IconSpaceItem, value: string) => void;
  onRenameCancel?: () => void;
  sortFn?: (a: IconSpaceItem, b: IconSpaceItem) => number;
  getDropProps?: (item: IconSpaceItem) => IDrop;
}

export function IconTileSpace({
  items,
  icon,
  size = 48,
  gap = 4,
  selected,
  isDragOver = false,
  editingId,
  canDrag = false,
  onSelect,
  onOpen,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
  sortFn,
  getDropProps,
}: IconTileSpaceProps): React.ReactNode {
  const sorted = sortFn ? [...items].sort(sortFn) : items;
  const colWidth = size + 16;

  return (
    <div
      className={[
        "overflow-y-auto overflow-x-hidden w-full h-full transition-colors",
        isDragOver ? "drag-over" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, ${colWidth}px)`,
        alignContent: "start",
        gap,
      }}
    >
      {sorted.map((item) => {
        const dropProps = getDropProps?.(item) ?? {};
        return (
          <IconTile
            key={item.id}
            icon={icon}
            label={item.label}
            ext={item.ext}
            size={size}
            selected={selected?.includes(item.id)}
            editing={editingId === item.id}
            canDrag={canDrag}
            dragMeta={item.dragMeta}
            onClick={() => onSelect?.(item.id)}
            onDoubleClick={() => onOpen?.(item)}
            onContextMenu={(e) => onContextMenu?.(item, e)}
            onRenameConfirm={(value) => onRenameConfirm?.(item, value)}
            onRenameCancel={onRenameCancel}
            {...dropProps}
          />
        );
      })}
    </div>
  );
}
