import { describe, expect, it } from 'vitest';
import { mixedBounds, mixedComponents, mixedRect } from './mixedComponents';

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

describe('mixedRect', () => {
  it('marks the mixed fields', () => {
    expect(
      mixedRect([
        { x: 0, y: 0, width: 1, height: 1 },
        { x: 0, y: 3, width: 1, height: 1 },
      ]),
    ).toEqual({ x: false, y: true, width: false, height: false });
  });
});

describe('mixedBounds', () => {
  it('marks the mixed components', () => {
    expect(
      mixedBounds([
        { center: [0, 0, 0], size: [1, 1, 1] },
        { center: [0, 0, 1], size: [1, 1, 1] },
      ]),
    ).toEqual({ center: [false, false, true], size: [false, false, false] });
  });
});
