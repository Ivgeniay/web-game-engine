import { describe, expect, it } from 'vitest';
import { samePropertyValue } from './propertyValue';

describe('samePropertyValue', () => {
  it('compares primitives with Object.is', () => {
    expect(samePropertyValue(1, 1)).toBe(true);
    expect(samePropertyValue(Number.NaN, Number.NaN)).toBe(true);
    expect(samePropertyValue('a', 'b')).toBe(false);
    expect(samePropertyValue(null, undefined)).toBe(false);
  });

  it('compares arrays item by item', () => {
    expect(samePropertyValue([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(samePropertyValue([1, 2], [1, 2, 3])).toBe(false);
    expect(samePropertyValue([[1], [2]], [[1], [3]])).toBe(false);
  });

  it('compares plain objects key by key, nested ones too', () => {
    const color = { r: 1, g: 0.5, b: 0, a: 1 };

    expect(samePropertyValue(color, { ...color })).toBe(true);
    expect(samePropertyValue(color, { ...color, a: 0 })).toBe(false);
    expect(samePropertyValue({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(
      samePropertyValue(
        { center: [0, 1, 0], size: [1, 1, 1] },
        { center: [0, 1, 0], size: [1, 1, 1] },
      ),
    ).toBe(true);
  });

  it('does not treat an array and an object with the same keys as equal', () => {
    expect(samePropertyValue([1], { 0: 1 })).toBe(false);
  });
});
