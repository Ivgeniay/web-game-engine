import { describe, expect, it } from 'vitest';
import {
  mergeChangedBounds,
  mergeChangedComponents,
  mergeChangedRect,
  mixedBounds,
  mixedComponents,
  mixedRect,
} from './componentChanges';

describe('mergeChangedComponents', () => {
  it('changes only the components that differ from the shown value', () => {
    expect(mergeChangedComponents([1, 2, 3], [5, 0, 0], [0, 0, 0])).toEqual([5, 2, 3]);
  });
});

describe('mixedComponents', () => {
  it('marks components that differ between the values', () => {
    expect(
      mixedComponents([
        [1, 2, 3],
        [1, 5, 3],
      ]),
    ).toEqual([false, true, false]);
    expect(mixedComponents([])).toEqual([]);
  });
});

describe('rect changes', () => {
  it('changes only the touched fields', () => {
    const shown = { x: 0, y: 0, width: 1, height: 1 };

    expect(
      mergeChangedRect({ x: 4, y: 4, width: 2, height: 2 }, { ...shown, width: 9 }, shown),
    ).toEqual({ x: 4, y: 4, width: 9, height: 2 });
  });

  it('marks the mixed fields', () => {
    expect(
      mixedRect([
        { x: 0, y: 0, width: 1, height: 1 },
        { x: 0, y: 3, width: 1, height: 1 },
      ]),
    ).toEqual({ x: false, y: true, width: false, height: false });
  });
});

describe('bounds changes', () => {
  it('changes only the touched components of the center and the size', () => {
    const shown = { center: [0, 0, 0], size: [1, 1, 1] };

    expect(
      mergeChangedBounds(
        { center: [5, 5, 5], size: [2, 2, 2] },
        { center: [0, 7, 0], size: [1, 1, 1] },
        shown,
      ),
    ).toEqual({ center: [5, 7, 5], size: [2, 2, 2] });
  });

  it('marks the mixed components', () => {
    expect(
      mixedBounds([
        { center: [0, 0, 0], size: [1, 1, 1] },
        { center: [0, 0, 1], size: [1, 1, 1] },
      ]),
    ).toEqual({ center: [false, false, true], size: [false, false, false] });
  });
});
