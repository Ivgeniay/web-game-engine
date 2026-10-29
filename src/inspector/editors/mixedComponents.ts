import type { Bounds, Rect } from '@/contracts/geometry';
import type { BoundsMixed } from '@/ui/boundsField/BoundsField';
import type { RectMixed } from '@/ui/rectField/RectField';

type Vector = readonly number[];

export function mixedComponents(values: readonly Vector[]): readonly boolean[] {
  const [first = []] = values;

  return first.map((component, index) => values.some((value) => value[index] !== component));
}

export function mixedRect(values: readonly Rect[]): RectMixed {
  const [first] = values;
  const mixed = (key: keyof Rect) =>
    first !== undefined && values.some((value) => value[key] !== first[key]);

  return { x: mixed('x'), y: mixed('y'), width: mixed('width'), height: mixed('height') };
}

export function mixedBounds(values: readonly Bounds[]): BoundsMixed {
  return {
    center: mixedComponents(values.map((value) => value.center)),
    size: mixedComponents(values.map((value) => value.size)),
  };
}
