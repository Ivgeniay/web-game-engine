import { describe, expect, it } from 'vitest';
import { colorChannels, colorOfPicker, keepPickerColor, pickerColorOf } from './colorChannels';
import type { ColorChannel, ColorMode } from './colorChannels';

const TEAL = { r: 0, g: 0.5, b: 0.5, a: 0.5 };

function channel(mode: ColorMode, letter: string): ColorChannel {
  const found = colorChannels(mode, true).find((item) => item.letter === letter);

  if (found === undefined) {
    throw new Error(`No channel ${letter} in ${mode}`);
  }

  return found;
}

describe('colorChannels', () => {
  it('lists the channels of each model with alpha on request', () => {
    expect(colorChannels('rgb255', true).map((item) => item.letter)).toEqual(['R', 'G', 'B', 'A']);
    expect(colorChannels('hsv', false).map((item) => item.letter)).toEqual(['H', 'S', 'V']);
  });

  it('reads channels in the scale of the model', () => {
    const color = pickerColorOf(TEAL);

    expect(channel('rgb255', 'G').read(color)).toBe(128);
    expect(channel('rgb255', 'A').read(color)).toBe(128);
    expect(channel('rgb1', 'G').read(color)).toBeCloseTo(0.5);
    expect(channel('hsv', 'H').read(color)).toBeCloseTo(180);
    expect(channel('hsv', 'S').read(color)).toBeCloseTo(100);
    expect(channel('hsv', 'A').read(color)).toBeCloseTo(50);
  });

  it('writes a channel and keeps the others', () => {
    const color = pickerColorOf(TEAL);
    const redder = colorOfPicker(channel('rgb255', 'R').write(color, 255));

    expect(redder.r).toBeCloseTo(1);
    expect(redder.g).toBeCloseTo(0.5);
    expect(redder.a).toBe(0.5);

    const darker = colorOfPicker(channel('hsv', 'V').write(color, 25));

    expect(darker.g).toBeCloseTo(0.25);
    expect(channel('rgb1', 'A').write(color, 2).a).toBe(1);
  });
});

describe('keepPickerColor', () => {
  it('keeps the hue and saturation through gray and black', () => {
    const red = pickerColorOf({ r: 1, g: 0, b: 0, a: 1 });
    const black = keepPickerColor(
      { ...red, hsv: { h: 200, s: 0.8, v: 1 } },
      { r: 0, g: 0, b: 0, a: 1 },
    );

    expect(black.hsv).toEqual({ h: 200, s: 0.8, v: 0 });

    const gray = keepPickerColor(black, { r: 0.5, g: 0.5, b: 0.5, a: 1 });

    expect(gray.hsv).toEqual({ h: 200, s: 0, v: 0.5 });
  });

  it('returns the previous state when it already gives the color', () => {
    const previous = { hsv: { h: 120, s: 0, v: 0.5 }, a: 1 };

    expect(keepPickerColor(previous, colorOfPicker(previous))).toBe(previous);
  });
});
