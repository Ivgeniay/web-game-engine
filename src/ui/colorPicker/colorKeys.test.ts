import { describe, expect, it } from 'vitest';
import { areaKeyValue, stripKeyValue } from './colorKeys';

const NO_MODIFIERS = { shiftKey: false, altKey: false };
const ALT = { shiftKey: false, altKey: true };

describe('stripKeyValue', () => {
  it('moves by one step, ten on page keys, and to the edges', () => {
    expect(stripKeyValue('ArrowRight', NO_MODIFIERS, 0.5, 100)).toBeCloseTo(0.51);
    expect(stripKeyValue('PageDown', NO_MODIFIERS, 0.5, 100)).toBeCloseTo(0.4);
    expect(stripKeyValue('ArrowUp', ALT, 0.95, 100)).toBe(1);
    expect(stripKeyValue('Home', NO_MODIFIERS, 0.5, 100)).toBe(0);
    expect(stripKeyValue('End', NO_MODIFIERS, 0.5, 100)).toBe(1);
    expect(stripKeyValue('Enter', NO_MODIFIERS, 0.5, 100)).toBeUndefined();
  });
});

describe('areaKeyValue', () => {
  it('moves saturation horizontally and brightness vertically', () => {
    expect(areaKeyValue('ArrowLeft', NO_MODIFIERS, { s: 0.5, v: 0.5 })).toEqual({
      s: 0.49,
      v: 0.5,
    });
    expect(areaKeyValue('ArrowUp', ALT, { s: 0.5, v: 0.5 })).toEqual({ s: 0.5, v: 0.6 });
    expect(areaKeyValue('PageDown', NO_MODIFIERS, { s: 0.5, v: 0.05 })).toEqual({ s: 0.5, v: 0 });
    expect(areaKeyValue('End', NO_MODIFIERS, { s: 0.5, v: 0.5 })).toEqual({ s: 1, v: 0.5 });
    expect(areaKeyValue('Tab', NO_MODIFIERS, { s: 0.5, v: 0.5 })).toBeUndefined();
  });
});
