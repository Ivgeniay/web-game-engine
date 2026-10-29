export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Bounds {
  readonly center: readonly number[];
  readonly size: readonly number[];
}
