import type { Bounds, Rect } from '@/contracts/geometry';
import type { BoundsMixed } from '@/ui/boundsField/BoundsField';
import type { RectMixed } from '@/ui/rectField/RectField';

type Vector = readonly number[];

export function mergeChangedComponents(own: Vector, value: Vector, shown: Vector): Vector {
  return own.map((component, index) =>
    value[index] === shown[index] ? component : (value[index] ?? component),
  );
}

export function mixedComponents(values: readonly Vector[]): readonly boolean[] {
  const [first = []] = values;

  return first.map((component, index) => values.some((value) => value[index] !== component));
}

export function mergeChangedRect(own: Rect, value: Rect, shown: Rect): Rect {
  const changed = (key: keyof Rect) => (value[key] === shown[key] ? own[key] : value[key]);

  return { x: changed('x'), y: changed('y'), width: changed('width'), height: changed('height') };
}

export function mixedRect(values: readonly Rect[]): RectMixed {
  const [first] = values;
  const mixed = (key: keyof Rect) =>
    first !== undefined && values.some((value) => value[key] !== first[key]);

  return { x: mixed('x'), y: mixed('y'), width: mixed('width'), height: mixed('height') };
}

export function mergeChangedBounds(own: Bounds, value: Bounds, shown: Bounds): Bounds {
  return {
    center: mergeChangedComponents(own.center, value.center, shown.center),
    size: mergeChangedComponents(own.size, value.size, shown.size),
  };
}

export function mixedBounds(values: readonly Bounds[]): BoundsMixed {
  return {
    center: mixedComponents(values.map((value) => value.center)),
    size: mixedComponents(values.map((value) => value.size)),
  };
}
