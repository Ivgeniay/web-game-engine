import type { IconProps } from "./types";
import type { IDraggable, IDrop, DragMeta } from "../dnd/types";
import { useDraggable } from "../../hooks/useDraggable";
import { useDropZone } from "../../hooks/useDropZone";

interface IconTileProps extends IDraggable, IDrop {
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

export function IconTile({
  icon: Icon,
  label,
  ext = "",
  size = 48,
  selected = false,
  disabled = false,
  canDrag = false,
  dragMeta,
  accepts,
  onDrop,
  onClick,
  onDoubleClick,
}: IconTileProps): React.ReactElement {
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
        "flex flex-col items-center gap-1 p-1 rounded cursor-pointer select-none transition-colors",
        selected ? "bg-accent" : isDragOver ? "drag-over" : "hover:bg-hover",
        disabled ? "opacity-40 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size + 16 }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={canDrag ? onMouseDown : undefined}
    >
      <Icon ext={ext} size={size} />
      <span
        className={[
          "text-xs text-center break-words leading-tight",
          disabled ? "text-disabled" : "text-primary",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {label}
      </span>
    </div>
  );
}
