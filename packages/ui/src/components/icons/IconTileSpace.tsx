import type { IconProps } from "./types";
import { IconTile } from "./IconTile";

export interface IconSpaceItem extends IconProps {
  label: string;
  id: string;
}

interface IconTileSpaceProps {
  items: IconSpaceItem[];
  icon: React.ComponentType<IconProps>;
  size?: number;
  gap?: number;
  selected?: string[];
  isDragOver?: boolean;
  onSelect?: (label: string) => void;
  onOpen?: (item: IconSpaceItem) => void;
  sortFn?: (a: IconSpaceItem, b: IconSpaceItem) => number;
}

export function IconTileSpace({
  items,
  icon,
  size = 48,
  gap = 4,
  selected,
  isDragOver = false,
  onSelect,
  onOpen,
  sortFn,
}: IconTileSpaceProps) {
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
      {sorted.map((item) => (
        <IconTile
          key={item.id}
          icon={icon}
          label={item.label}
          ext={item.ext}
          size={size}
          selected={selected && selected.indexOf(item.id) > -1}
          onClick={() => onSelect?.(item.label)}
          onDoubleClick={() => onOpen?.(item)}
        />
      ))}
    </div>
  );
}
