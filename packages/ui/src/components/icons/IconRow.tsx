import type { IconProps } from "./types";
import type { IDraggable, IDrop, DragMeta } from "../dnd/types";
import { useDraggable } from "../../hooks/useDraggable";
import { useDropZone } from "../../hooks/useDropZone";
import { useNativeDropZone } from "../../hooks/useNativeDropZone";
import { EditableLabel } from "../common/EditableLabel";

interface IconRowProps extends IDraggable, IDrop {
  icon: React.ComponentType<IconProps>;
  label: string;
  ext?: string;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  editing?: boolean;
  dragMeta?: DragMeta;
  onNativeDrop?: (files: FileList) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onRenameConfirm?: (value: string) => void;
  onRenameCancel?: () => void;
}

export function IconRow({
  icon: Icon,
  label,
  ext = "",
  size = 16,
  selected = false,
  disabled = false,
  editing = false,
  canDrag = false,
  dragMeta,
  accepts,
  onDrop,
  onNativeDrop,
  onClick,
  onDoubleClick,
  onContextMenu,
  onRenameConfirm,
  onRenameCancel,
}: IconRowProps): React.ReactElement {
  const { ref: dragRef, onMouseDown } = useDraggable(dragMeta ?? {});
  const { ref: dropRef, isDragOver } = useDropZone(accepts ?? {}, onDrop);
  const { ref: nativeRef, isDragOver: isNativeDragOver } =
    useNativeDropZone(onNativeDrop);

  const mergedRef = (node: HTMLDivElement | null) => {
    dragRef.current = node;
    dropRef.current = node;
    nativeRef.current = node;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(e);
  };

  return (
    <div
      ref={mergedRef}
      className={[
        "flex items-center gap-1.5 px-1 py-0.5 rounded cursor-pointer select-none transition-colors w-full",
        selected
          ? "bg-accent"
          : isDragOver || isNativeDragOver
            ? "drag-over"
            : "hover:bg-hover",
        disabled ? "opacity-40 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={canDrag && !editing ? onMouseDown : undefined}
      onContextMenu={handleContextMenu}
    >
      <Icon ext={ext} size={size} />
      <EditableLabel
        value={label}
        editing={editing}
        className={[
          "text-xs leading-tight flex-1 min-w-0",
          disabled ? "text-disabled" : "text-primary",
        ]
          .filter(Boolean)
          .join(" ")}
        onConfirm={onRenameConfirm}
        onCancel={onRenameCancel}
      />
    </div>
  );
}
