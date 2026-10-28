export const ICON_SIZES = ['sm', 'md'] as const;

export type IconSize = (typeof ICON_SIZES)[number];

export const ICON_GRID_SIZES = { sm: 12, md: 16 } as const satisfies Readonly<
  Record<IconSize, number>
>;

export const ICON_GRID_PADDING = 1;

export interface IconStroke {
  readonly kind: 'stroke';
  readonly d: string;
}

export interface IconCircle {
  readonly kind: 'circle';
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
}

export interface IconFilledRect {
  readonly kind: 'fill-rect';
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type IconShape = IconStroke | IconCircle | IconFilledRect;

export type IconDrawing = readonly IconShape[];

export interface IconDefinition {
  readonly md: IconDrawing;
  readonly sm?: IconDrawing;
}

export type IconSet<N extends string> = Readonly<Record<N, IconDefinition>>;

export interface IconRef {
  readonly set: IconSet<string>;
  readonly name: string;
}

export type IconSource = IconDefinition | IconRef;

export function stroke(d: string): IconStroke {
  return { kind: 'stroke', d };
}

export function circle(cx: number, cy: number, r: number): IconCircle {
  return { kind: 'circle', cx, cy, r };
}

export function fillRect(x: number, y: number, width: number, height: number): IconFilledRect {
  return { kind: 'fill-rect', x, y, width, height };
}

export function defineIcon(definition: IconDefinition): IconDefinition {
  return definition;
}

export function defineIcons<N extends string>(icons: IconSet<N>): IconSet<N> {
  return icons;
}

export function iconRef(set: IconSet<string>, name: string): IconRef {
  return { set, name };
}
