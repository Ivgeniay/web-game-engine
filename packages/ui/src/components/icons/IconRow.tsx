import type { IconProps } from "./types";

interface IconRowProps {
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

export function IconRow({
  icon: Icon,
  label,
  ext = "",
  size = 16,
  selected = false,
  disabled = false,
  isDragOver = false,
  onClick,
  onDoubleClick,
}: IconRowProps) {
  return (
    <div
      className={[
        "flex items-center gap-1.5 px-1 py-3.5 rounded cursor-pointer select-none transition-colors w-full",
        selected ? "bg-accent" : isDragOver ? "drag-over" : "hover:bg-hover",
        disabled ? "opacity-40 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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

// import type { IconProps } from "./types";

// interface IconRowProps {
//   icon: React.ComponentType<IconProps>;
//   label: string;
//   ext?: string;
//   size?: number;
//   selected?: boolean;
//   disabled?: boolean;
//   onClick?: () => void;
//   onDoubleClick?: () => void;
// }

// export function IconRow({
//   icon: Icon,
//   label,
//   ext = "",
//   size = 16,
//   selected = false,
//   disabled = false,
//   onClick,
//   onDoubleClick,
// }: IconRowProps) {
//   return (
//     <div
//       className={[
//         "flex items-center gap-1.5 px-1 py-0.5 rounded cursor-pointer select-none",
//         "transition-colors w-full",
//         selected ? "bg-accent" : "hover:bg-hover",
//         disabled ? "opacity-40 pointer-events-none" : "",
//       ]
//         .filter(Boolean)
//         .join(" ")}
//       onClick={onClick}
//       onDoubleClick={onDoubleClick}
//     >
//       <Icon ext={ext} size={size} />
//       <span
//         className={[
//           "text-xs text-primary leading-tight truncate flex-1 min-w-0",
//           disabled ? "text-disabled" : "",
//         ]
//           .filter(Boolean)
//           .join(" ")}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }
