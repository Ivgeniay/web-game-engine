import { describe, expect, it } from 'vitest';
import { contrastRatio, parseColorTokens, parseHexColor } from './contrast';

const BLACK = '#000000';
const WHITE = '#ffffff';
const MID_GRAY = '#777777';

const MAX_CONTRAST = 21;
const MIN_CONTRAST = 1;
const MID_GRAY_ON_WHITE_CONTRAST = 4.48;
const PRECISION_DIGITS = 2;

const SAMPLE_COLORS = ['#000000', '#ffffff', '#3874cc', '#c4342d', '#2b2b2b'];

const INVALID_HEX_COLORS = [
  'color-mix(in srgb, #3874cc 8%, transparent)',
  'rgb(0 0 0 / 50%)',
  'transparent',
  '#fff',
];

describe('contrastRatio', () => {
  it('gives the maximum contrast for black on white', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(MAX_CONTRAST, PRECISION_DIGITS);
  });

  it.each(SAMPLE_COLORS)('gives the minimum contrast for %s on itself', (color) => {
    expect(contrastRatio(color, color)).toBeCloseTo(MIN_CONTRAST, PRECISION_DIGITS);
  });

  it.each(SAMPLE_COLORS)('does not depend on argument order for %s and mid gray', (color) => {
    expect(contrastRatio(color, MID_GRAY)).toBeCloseTo(
      contrastRatio(MID_GRAY, color),
      PRECISION_DIGITS,
    );
  });

  it('matches the reference value for mid gray on white', () => {
    expect(contrastRatio(MID_GRAY, WHITE)).toBeCloseTo(
      MID_GRAY_ON_WHITE_CONTRAST,
      PRECISION_DIGITS,
    );
  });
});

describe('parseHexColor', () => {
  it('parses channels of a #rrggbb color', () => {
    expect(parseHexColor('#3874CC')).toEqual({ red: 56, green: 116, blue: 204 });
  });

  it.each(INVALID_HEX_COLORS)('throws on %s', (value) => {
    expect(() => parseHexColor(value)).toThrow(value);
  });
});

describe('parseColorTokens', () => {
  it('collects color tokens without the prefix', () => {
    const tokens = parseColorTokens(
      ':root { --color-bg-app: #181818; --space-4: 4px; --color-shadow: rgb(0 0 0 / 50%); }',
    );

    expect([...tokens.entries()]).toEqual([
      ['bg-app', '#181818'],
      ['shadow', 'rgb(0 0 0 / 50%)'],
    ]);
  });

  it('throws on a duplicated token', () => {
    expect(() =>
      parseColorTokens(':root { --color-accent: #3874cc; --color-accent: #2f6fd1; }'),
    ).toThrow('accent');
  });
});
