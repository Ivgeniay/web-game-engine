import { describe, expect, it } from 'vitest';
import { arrowStepCount, decimalPlaces, offsetNumber, stepMultiplier } from './numberStep';
import type { NumberLimits } from './numberText';

const FLOAT: NumberLimits = { kind: 'float', min: undefined, max: undefined };
const INTEGER: NumberLimits = { kind: 'integer', min: undefined, max: undefined };
const UNIT: NumberLimits = { kind: 'float', min: 0, max: 1 };
const NO_MODIFIERS = { shiftKey: false, altKey: false };

describe('stepMultiplier', () => {
  it('makes the step finer with Shift and coarser with Alt', () => {
    expect(stepMultiplier(NO_MODIFIERS)).toBe(1);
    expect(stepMultiplier({ shiftKey: true, altKey: false })).toBe(0.1);
    expect(stepMultiplier({ shiftKey: false, altKey: true })).toBe(10);
  });
});

describe('decimalPlaces', () => {
  it.each([
    [0, 0],
    [12, 0],
    [0.1, 1],
    [-1.25, 2],
    [1e-7, 7],
    [1.5e-7, 8],
  ])('counts the decimal places of %d as %d', (value, places) => {
    expect(decimalPlaces(value)).toBe(places);
  });
});

describe('offsetNumber', () => {
  it('adds steps without floating point noise', () => {
    expect(offsetNumber(0.2, 1, 0.1, FLOAT)).toBe(0.3);
    expect(offsetNumber(0.1, 0.1, 0.1, FLOAT)).toBe(0.11);
  });

  it('keeps the precision of the value', () => {
    expect(offsetNumber(0.12345, 1, 0.1, FLOAT)).toBe(0.22345);
  });

  it('rounds integers', () => {
    expect(offsetNumber(5, 0.4, 1, INTEGER)).toBe(5);
    expect(offsetNumber(5, 2.6, 1, INTEGER)).toBe(8);
  });

  it('clamps to the limits', () => {
    expect(offsetNumber(0.95, 1, 0.1, UNIT)).toBe(1);
    expect(offsetNumber(0.05, -1, 0.1, UNIT)).toBe(0);
  });
});

describe('arrowStepCount', () => {
  it('gives the direction scaled by the modifiers', () => {
    expect(arrowStepCount(1, NO_MODIFIERS, 0.1, FLOAT)).toBe(1);
    expect(arrowStepCount(-1, { shiftKey: true, altKey: false }, 0.1, FLOAT)).toBe(-0.1);
    expect(arrowStepCount(1, { shiftKey: false, altKey: true }, 0.1, FLOAT)).toBe(10);
  });

  it('moves an integer by at least one', () => {
    expect(arrowStepCount(-1, { shiftKey: true, altKey: false }, 1, INTEGER)).toBe(-1);
    expect(arrowStepCount(1, { shiftKey: true, altKey: false }, 5, INTEGER)).toBe(0.2);
  });
});
