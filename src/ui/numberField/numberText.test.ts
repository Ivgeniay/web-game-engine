import { describe, expect, it } from 'vitest';
import {
  acceptsNumberText,
  clampNumber,
  createNumberFormat,
  formatNumber,
  readNumberText,
} from './numberText';
import type { NumberLimits } from './numberText';

const FLOAT: NumberLimits = { kind: 'float', min: undefined, max: undefined };
const INTEGER: NumberLimits = { kind: 'integer', min: undefined, max: undefined };
const PERCENT: NumberLimits = { kind: 'integer', min: 0, max: 100 };
const MESSAGES = { incomplete: 'incomplete', belowMin: 'below', aboveMax: 'above' };

describe('acceptsNumberText', () => {
  it.each(['', '-', '12', '-12', '007'])('accepts %j as an integer', (text) => {
    expect(acceptsNumberText(text, INTEGER)).toBe(true);
  });

  it.each(['a', '1a', '1.5', '1,5', '--1', '1-', ' 1', '1e3'])(
    'rejects %j as an integer',
    (text) => {
      expect(acceptsNumberText(text, INTEGER)).toBe(false);
    },
  );

  it.each(['', '-', '.', ',', '-.', '1.', '1.5', '1,5', '-0,25', '.5'])(
    'accepts %j as a float',
    (text) => {
      expect(acceptsNumberText(text, FLOAT)).toBe(true);
    },
  );

  it.each(['1.5.2', '1,5.2', '1..', 'x', '1e3', '+1'])('rejects %j as a float', (text) => {
    expect(acceptsNumberText(text, FLOAT)).toBe(false);
  });

  it('rejects a minus when the minimum is not negative', () => {
    expect(acceptsNumberText('-1', PERCENT)).toBe(false);
    expect(acceptsNumberText('-1', { ...PERCENT, min: -1 })).toBe(true);
  });
});

describe('readNumberText', () => {
  it.each([
    ['1.5', 1.5],
    ['1,5', 1.5],
    ['.5', 0.5],
    ['5.', 5],
    ['-0', 0],
  ])('reads %j as %d', (text, value) => {
    expect(readNumberText(text, FLOAT, MESSAGES)).toEqual({ valid: true, value });
  });

  it.each(['', '-', '.', '-,'])('reports %j as incomplete without a fallback', (text) => {
    expect(readNumberText(text, FLOAT, MESSAGES)).toEqual({
      valid: false,
      message: 'incomplete',
      fallback: undefined,
    });
  });

  it('clamps a value out of range to the nearest limit', () => {
    expect(readNumberText('150', PERCENT, MESSAGES)).toEqual({
      valid: false,
      message: 'above',
      fallback: 100,
    });
    expect(readNumberText('-5', { ...PERCENT, min: -1 }, MESSAGES)).toEqual({
      valid: false,
      message: 'below',
      fallback: -1,
    });
  });

  it('keeps integers within the safe range', () => {
    expect(readNumberText('99999999999999999999', INTEGER, MESSAGES)).toEqual({
      valid: false,
      message: 'above',
      fallback: Number.MAX_SAFE_INTEGER,
    });
  });

  it('treats an infinite float as incomplete', () => {
    expect(readNumberText(`1${'0'.repeat(400)}`, FLOAT, MESSAGES).valid).toBe(false);
  });
});

describe('clampNumber', () => {
  it('turns a negative zero into zero', () => {
    expect(Object.is(clampNumber(-0, FLOAT), 0)).toBe(true);
  });
});

describe('formatNumber', () => {
  it('uses the decimal separator of the language without grouping', () => {
    expect(formatNumber(12345.5, createNumberFormat('en', 'float', 3))).toBe('12345.5');
    expect(formatNumber(12345.5, createNumberFormat('ru', 'float', 3))).toBe('12345,5');
  });

  it('rounds to the precision', () => {
    expect(formatNumber(1.23456, createNumberFormat('en', 'float', 3))).toBe('1.235');
    expect(formatNumber(2.5, createNumberFormat('en', 'integer', 3))).toBe('3');
  });

  it('writes a hyphen minus and no sign for a rounded zero', () => {
    expect(formatNumber(-1.5, createNumberFormat('ru', 'float', 3))).toBe('-1,5');
    expect(formatNumber(-0.0001, createNumberFormat('en', 'float', 3))).toBe('0');
  });
});
