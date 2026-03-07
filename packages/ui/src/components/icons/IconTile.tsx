import type { IconProps } from "./types";

interface IconTileProps {
  icon: React.ComponentType<IconProps>;
  label: string;
  ext?: string;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  isDragOver?: boolean;
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
  isDragOver = false,
  onClick,
  onDoubleClick,
}: IconTileProps) {
  return (
    <div
      className={[
        "flex flex-col items-center  gap-1 p-1 rounded cursor-pointer select-none transition-colors",
        selected ? "bg-accent" : isDragOver ? "drag-over" : "hover:bg-accent",
        disabled ? "opacity-40 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size + 16 }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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
