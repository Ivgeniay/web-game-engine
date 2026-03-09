export const KIND_VALUES = [
  "file",
  "directory",
  "entity",
  "component",
] as const;

export const SOURCE_VALUES = [
  "file_explorer",
  "hierarchy",
  "inspector",
] as const;

export type kind = (typeof KIND_VALUES)[number];
export type source = (typeof SOURCE_VALUES)[number];

export const EXTRA_DRAG_TYPES = ["ext", "ext_exc", "kind_exc"] as const;
/**
 * "source" - откуда тянем: "file_explorer" | "hierarchy" | "inspector".
 * "kind" - вид объекта: "file" | "directory" | "entity" | "component"
 * "ext" - расширение файла
 * "kind_exc"; - исключение по виду
 * "ext_exc" - исключение по расширению
 */
export type DragType =
  | (typeof SOURCE_VALUES)[number]
  | (typeof KIND_VALUES)[number]
  | (typeof EXTRA_DRAG_TYPES)[number];

export type DragMeta = Partial<Record<DragType, string>>;
export type DropAccepts = Partial<Record<DragType, string | string[]>>;

export interface IDraggable {
  canDrag?: boolean;
  onDragStart?: (meta: DragMeta, ref: React.RefObject<HTMLElement>) => void;
  onDragEnd?: (meta: DragMeta) => void;
}

export interface IDrop {
  accepts?: DropAccepts;
  onDrop?: (source: DragMeta) => void;
}
