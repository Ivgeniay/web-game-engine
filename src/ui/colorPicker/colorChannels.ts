import type { Color } from '@/contracts/color';
import {
  BYTE_MAX,
  clampUnit,
  hsvToColor,
  MAX_HUE,
  PERCENT_MAX,
  rgbToHsv,
  sameColor,
  toByte,
} from '@/ui/color/colorModel';
import type { Hsv } from '@/ui/color/colorModel';
import type { NumberKind } from '@/ui/numberField/numberText';

export const COLOR_MODES = ['rgb255', 'rgb1', 'hsv'] as const;

export type ColorMode = (typeof COLOR_MODES)[number];

export const COLOR_CHANNEL_NAMES = [
  'red',
  'green',
  'blue',
  'hue',
  'saturation',
  'brightness',
  'alpha',
] as const;

export type ColorChannelName = (typeof COLOR_CHANNEL_NAMES)[number];

export interface PickerColor {
  readonly hsv: Hsv;
  readonly a: number;
}

export interface ColorChannel {
  readonly name: ColorChannelName;
  readonly letter: string;
  readonly min: number;
  readonly max: number;
  readonly kind: NumberKind;
  readonly precision: number;
  readonly step: number;
  readonly read: (color: PickerColor) => number;
  readonly write: (color: PickerColor, value: number) => PickerColor;
}

type RgbKey = 'r' | 'g' | 'b';

interface ChannelScale {
  readonly max: number;
  readonly kind: NumberKind;
  readonly precision: number;
  readonly step: number;
}

const BYTE_SCALE: ChannelScale = { max: BYTE_MAX, kind: 'integer', precision: 0, step: 1 };
const UNIT_SCALE: ChannelScale = { max: 1, kind: 'float', precision: 3, step: 0.01 };
const PERCENT_SCALE: ChannelScale = { max: PERCENT_MAX, kind: 'float', precision: 1, step: 1 };
const HUE_SCALE: ChannelScale = { max: MAX_HUE, kind: 'float', precision: 1, step: 1 };

const RGB_CHANNELS: readonly {
  readonly name: ColorChannelName;
  readonly letter: string;
  readonly key: RgbKey;
}[] = [
  { name: 'red', letter: 'R', key: 'r' },
  { name: 'green', letter: 'G', key: 'g' },
  { name: 'blue', letter: 'B', key: 'b' },
];

export function pickerColorOf(color: Color): PickerColor {
  return { hsv: rgbToHsv(color), a: color.a };
}

export function colorOfPicker({ hsv, a }: PickerColor): Color {
  return hsvToColor(hsv, a);
}

export function keepPickerColor(previous: PickerColor, color: Color): PickerColor {
  if (sameColor(colorOfPicker(previous), color)) {
    return previous;
  }

  const hsv = rgbToHsv(color);
  const grayscale = hsv.s === 0 || hsv.v === 0;

  return {
    hsv: {
      h: grayscale ? previous.hsv.h : hsv.h,
      s: hsv.v === 0 ? previous.hsv.s : hsv.s,
      v: hsv.v,
    },
    a: color.a,
  };
}

function scaledRead(scale: ChannelScale, unit: number): number {
  return scale.kind === 'integer' ? Math.round(unit * scale.max) : unit * scale.max;
}

function rgbChannel(
  name: ColorChannelName,
  letter: string,
  key: RgbKey,
  scale: ChannelScale,
): ColorChannel {
  return {
    name,
    letter,
    min: 0,
    max: scale.max,
    kind: scale.kind,
    precision: scale.precision,
    step: scale.step,
    read: (color) =>
      scale.kind === 'integer'
        ? toByte(colorOfPicker(color)[key])
        : colorOfPicker(color)[key] * scale.max,
    write: (color, value) =>
      keepPickerColor(color, { ...colorOfPicker(color), [key]: clampUnit(value / scale.max) }),
  };
}

function hsvChannel(
  name: ColorChannelName,
  letter: string,
  key: keyof Hsv,
  scale: ChannelScale,
): ColorChannel {
  const unitMax = key === 'h' ? MAX_HUE : 1;

  return {
    name,
    letter,
    min: 0,
    max: scale.max,
    kind: scale.kind,
    precision: scale.precision,
    step: scale.step,
    read: (color) => scaledRead(scale, color.hsv[key] / unitMax),
    write: (color, value) => ({
      ...color,
      hsv: { ...color.hsv, [key]: clampUnit(value / scale.max) * unitMax },
    }),
  };
}

function alphaChannel(scale: ChannelScale): ColorChannel {
  return {
    name: 'alpha',
    letter: 'A',
    min: 0,
    max: scale.max,
    kind: scale.kind,
    precision: scale.precision,
    step: scale.step,
    read: (color) => scaledRead(scale, color.a),
    write: (color, value) => ({ ...color, a: clampUnit(value / scale.max) }),
  };
}

function modeChannels(mode: ColorMode): readonly ColorChannel[] {
  switch (mode) {
    case 'rgb255':
      return RGB_CHANNELS.map(({ name, letter, key }) => rgbChannel(name, letter, key, BYTE_SCALE));
    case 'rgb1':
      return RGB_CHANNELS.map(({ name, letter, key }) => rgbChannel(name, letter, key, UNIT_SCALE));
    case 'hsv':
      return [
        hsvChannel('hue', 'H', 'h', HUE_SCALE),
        hsvChannel('saturation', 'S', 's', PERCENT_SCALE),
        hsvChannel('brightness', 'V', 'v', PERCENT_SCALE),
      ];
  }
}

const ALPHA_SCALES: Readonly<Record<ColorMode, ChannelScale>> = {
  rgb255: BYTE_SCALE,
  rgb1: UNIT_SCALE,
  hsv: PERCENT_SCALE,
};

export function colorChannels(mode: ColorMode, showAlpha: boolean): readonly ColorChannel[] {
  const channels = modeChannels(mode);

  return showAlpha ? [...channels, alphaChannel(ALPHA_SCALES[mode])] : channels;
}
