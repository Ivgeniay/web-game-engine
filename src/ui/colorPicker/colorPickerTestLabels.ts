import type { ColorFieldLabels } from '@/ui/colorField/ColorField';

const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };

export const TEST_COLOR_LABELS: ColorFieldLabels = {
  picker: 'Color picker',
  area: 'Saturation and brightness',
  areaRole: '2D slider',
  areaValue: (saturation, brightness) =>
    `Saturation ${String(saturation)}%, brightness ${String(brightness)}%`,
  hue: 'Hue',
  alpha: 'Alpha',
  model: 'Color model',
  models: { rgb255: 'RGB 0–255', rgb1: 'RGB 0–1', hsv: 'HSV' },
  channels: {
    red: 'Red',
    green: 'Green',
    blue: 'Blue',
    hue: 'Hue value',
    saturation: 'Saturation',
    brightness: 'Brightness',
    alpha: 'Alpha value',
  },
  hex: 'Hex',
  invalidHex: 'Enter 6 or 8 hex digits',
  eyedropper: 'Pick a color from the screen',
  numberMessages: () => MESSAGES,
};
