import { describe, expect, it } from 'vitest';
import {
  alphaGradient,
  colorToHex,
  cssColor,
  hsvToColor,
  hueSpectrumGradient,
  parseHex,
  rgbToHsv,
  sameColor,
} from './colorModel';

const RED = { r: 1, g: 0, b: 0, a: 1 };
const TEAL = { r: 0, g: 0.5, b: 0.5, a: 1 };

describe('rgbToHsv and hsvToColor', () => {
  it('converts the primary colors and gray', () => {
    expect(rgbToHsv(RED)).toEqual({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv({ r: 0, g: 1, b: 0, a: 1 })).toEqual({ h: 120, s: 1, v: 1 });
    expect(rgbToHsv({ r: 0, g: 0, b: 1, a: 1 })).toEqual({ h: 240, s: 1, v: 1 });
    expect(rgbToHsv({ r: 0.5, g: 0.5, b: 0.5, a: 1 })).toEqual({ h: 0, s: 0, v: 0.5 });
  });

  it('goes there and back without loss', () => {
    const hsv = rgbToHsv(TEAL);

    expect(hsv.h).toBeCloseTo(180);
    const back = hsvToColor(hsv, TEAL.a);
    expect(back.r).toBeCloseTo(TEAL.r);
    expect(back.g).toBeCloseTo(TEAL.g);
    expect(back.b).toBeCloseTo(TEAL.b);
  });

  it('wraps the hue and clamps saturation, value and alpha', () => {
    expect(hsvToColor({ h: 360, s: 2, v: 1 }, 3)).toEqual(RED);
    expect(hsvToColor({ h: -120, s: 1, v: 1 }, 1)).toEqual({ r: 0, g: 0, b: 1, a: 1 });
  });
});

describe('hex', () => {
  it('shows six digits for an opaque color and eight with alpha when asked', () => {
    expect(colorToHex(TEAL, true)).toBe('008080');
    expect(colorToHex({ ...TEAL, a: 0.5 }, true)).toBe('00808080');
    expect(colorToHex({ ...TEAL, a: 0.5 }, false)).toBe('008080');
  });

  it('reads six or eight digits with or without a hash and keeps the alpha for six', () => {
    expect(parseHex('#FF0000', 0.25)).toEqual({ ...RED, a: 0.25 });
    expect(parseHex('ff000000', 1)).toEqual({ ...RED, a: 0 });
    expect(parseHex(' 00ff00 ', 1)).toEqual({ r: 0, g: 1, b: 0, a: 1 });
  });

  it('rejects other lengths and letters', () => {
    expect(parseHex('fff', 1)).toBeUndefined();
    expect(parseHex('ff00zz', 1)).toBeUndefined();
    expect(parseHex('', 1)).toBeUndefined();
  });
});

describe('css values', () => {
  it('writes a color and gradients as css', () => {
    expect(cssColor({ ...TEAL, a: 0.5 })).toBe('rgb(0 128 128 / 0.5)');
    expect(alphaGradient(RED)).toBe(
      'linear-gradient(to right, rgb(255 0 0 / 0), rgb(255 0 0 / 1))',
    );
    expect(hueSpectrumGradient()).toContain('rgb(0 255 0 / 1)');
  });

  it('compares colors by channels', () => {
    expect(sameColor(RED, { ...RED })).toBe(true);
    expect(sameColor(RED, { ...RED, a: 0.5 })).toBe(false);
  });
});
