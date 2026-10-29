import { describe, expect, it } from 'vitest';
import { assertSliderRange, positionToValue, sliderKeyValue, valueToPosition } from './sliderScale';
import type { SliderRange } from './sliderScale';

const LINEAR: SliderRange = { min: 0, max: 10, scale: 'linear', kind: 'float' };
const INTEGER: SliderRange = { min: 0, max: 100, scale: 'linear', kind: 'integer' };
const LOG: SliderRange = { min: 1, max: 1000, scale: 'log', kind: 'float' };
const LOG_INTEGER: SliderRange = { min: 1, max: 1000, scale: 'log', kind: 'integer' };
const NO_MODIFIERS = { shiftKey: false, altKey: false };
const SHIFT = { shiftKey: true, altKey: false };
const ALT = { shiftKey: false, altKey: true };
const TRACK_WIDTH = 100;

describe('valueToPosition', () => {
  it('maps a linear range and clamps outside values', () => {
    expect(valueToPosition(2.5, LINEAR)).toBe(0.25);
    expect(valueToPosition(-3, LINEAR)).toBe(0);
    expect(valueToPosition(12, LINEAR)).toBe(1);
  });

  it('maps a logarithmic range by orders of magnitude', () => {
    expect(valueToPosition(1, LOG)).toBe(0);
    expect(valueToPosition(10, LOG)).toBeCloseTo(1 / 3);
    expect(valueToPosition(100, LOG)).toBeCloseTo(2 / 3);
    expect(valueToPosition(1000, LOG)).toBe(1);
  });
});

describe('positionToValue', () => {
  it('rounds a linear value to what one division can show', () => {
    expect(positionToValue(0.333333, LINEAR, TRACK_WIDTH)).toBe(3.3);
    expect(positionToValue(0.333333, LINEAR, TRACK_WIDTH * 10)).toBe(3.33);
  });

  it('rounds an integer range to whole numbers and clamps the position', () => {
    expect(positionToValue(0.426, INTEGER, TRACK_WIDTH)).toBe(43);
    expect(positionToValue(1.4, INTEGER, TRACK_WIDTH)).toBe(100);
    expect(positionToValue(-0.2, INTEGER, TRACK_WIDTH)).toBe(0);
  });

  it('inverts a logarithmic position with a resolution relative to the value', () => {
    expect(positionToValue(1 / 3, LOG, TRACK_WIDTH)).toBe(10);
    expect(positionToValue(0.9, LOG, TRACK_WIDTH)).toBe(501);
  });
});

describe('sliderKeyValue', () => {
  it('moves by a step on arrows and by ten steps on page keys', () => {
    expect(sliderKeyValue('ArrowRight', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(5.1);
    expect(sliderKeyValue('ArrowDown', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(4.9);
    expect(sliderKeyValue('PageUp', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(6);
    expect(sliderKeyValue('PageDown', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(4);
  });

  it('applies the fine and coarse modifiers and keeps integers whole', () => {
    expect(sliderKeyValue('ArrowUp', SHIFT, 5, 0.1, LINEAR)).toBe(5.01);
    expect(sliderKeyValue('ArrowUp', ALT, 5, 0.1, LINEAR)).toBe(6);
    expect(sliderKeyValue('ArrowUp', SHIFT, 5, 1, INTEGER)).toBe(6);
  });

  it('goes to the edges on Home and End and stays within the range', () => {
    expect(sliderKeyValue('Home', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(0);
    expect(sliderKeyValue('End', NO_MODIFIERS, 5, 0.1, LINEAR)).toBe(10);
    expect(sliderKeyValue('PageUp', NO_MODIFIERS, 9.5, 0.1, LINEAR)).toBe(10);
  });

  it('steps a logarithmic slider along the track position', () => {
    expect(sliderKeyValue('PageUp', NO_MODIFIERS, 10, 0.1, LOG)).toBeCloseTo(20, 0);
    expect(sliderKeyValue('PageUp', NO_MODIFIERS, 100, 0.1, LOG)).toBeCloseTo(200, -1);
  });

  it('moves a logarithmic integer by at least one', () => {
    expect(sliderKeyValue('ArrowRight', NO_MODIFIERS, 1, 1, LOG_INTEGER)).toBe(2);
    expect(sliderKeyValue('ArrowLeft', NO_MODIFIERS, 1, 1, LOG_INTEGER)).toBe(1);
  });

  it('ignores other keys', () => {
    expect(sliderKeyValue('Enter', NO_MODIFIERS, 5, 0.1, LINEAR)).toBeUndefined();
  });
});

describe('assertSliderRange', () => {
  it('rejects an empty range and a logarithmic range from zero', () => {
    expect(() => {
      assertSliderRange({ ...LINEAR, max: 0 });
    }).toThrow();
    expect(() => {
      assertSliderRange({ ...LOG, min: 0 });
    }).toThrow();
    expect(() => {
      assertSliderRange(LOG);
    }).not.toThrow();
  });
});
