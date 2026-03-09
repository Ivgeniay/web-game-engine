import type { IconProps } from "./types";
import type { IDraggable, IDrop, DragMeta } from "../dnd/types";
import { useDraggable } from "../../hooks/useDraggable";
import { useDropZone } from "../../hooks/useDropZone";

interface IconRowProps extends IDraggable, IDrop {
  icon: React.ComponentType<IconProps>;
  label: string;
  ext?: string;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  dragMeta?: DragMeta;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export function IconRow({
  icon: Icon,
  label,
  ext = "",
  size = 16,
  selected = false,
  disabled = false,
  canDrag = false,
  dragMeta,
  accepts,
  onDrop,
  onClick,
  onDoubleClick,
}: IconRowProps): React.ReactElement {
  const { ref: dragRef, onMouseDown } = useDraggable(dragMeta ?? {});
  const { ref: dropRef, isDragOver } = useDropZone(accepts ?? {}, onDrop);

  const mergedRef = (node: HTMLDivElement | null) => {
    dragRef.current = node;
    dropRef.current = node;
  };

  return (
    <div
      ref={mergedRef}
      className={[
        "flex items-center gap-1.5 px-1 py-0.5 rounded cursor-pointer select-none transition-colors w-full",
        selected ? "bg-accent" : isDragOver ? "drag-over" : "hover:bg-hover",
        disabled ? "opacity-40 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={canDrag ? onMouseDown : undefined}
    >
      <Icon ext={ext} size={size} />
      <span
        className={[
          "text-xs leading-tight truncate flex-1 min-w-0",
          disabled ? "text-disabled" : "text-primary",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
