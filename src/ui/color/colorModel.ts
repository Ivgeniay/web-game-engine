import type { Color } from '@/contracts/color';

export interface Hsv {
  readonly h: number;
  readonly s: number;
  readonly v: number;
}

export const MAX_HUE = 360;
export const BYTE_MAX = 255;
export const PERCENT_MAX = 100;

const HUE_SECTORS = 6;
const HUE_SECTOR = MAX_HUE / HUE_SECTORS;
const HEX_RADIX = 16;
const HEX_BYTE_DIGITS = 2;
const HEX_TEXT = /^#?([0-9a-f]{6}|[0-9a-f]{8})$/i;
const OPAQUE = 1;
const GREEN_SECTOR_START = 2;
const BLUE_SECTOR_START = 4;
const SECTOR_RAMP_END = 4;
const RED_OFFSET = 5;
const GREEN_OFFSET = 3;
const BLUE_OFFSET = 1;

export function clampUnit(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

export function clampColor({ r, g, b, a }: Color): Color {
  return { r: clampUnit(r), g: clampUnit(g), b: clampUnit(b), a: clampUnit(a) };
}

export function sameColor(first: Color, second: Color): boolean {
  return (
    first.r === second.r && first.g === second.g && first.b === second.b && first.a === second.a
  );
}

interface HueInput {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly max: number;
  readonly delta: number;
}

function hueSector({ r, g, b, max, delta }: HueInput): number {
  if (max === r) {
    return ((g - b) / delta + HUE_SECTORS) % HUE_SECTORS;
  }

  return max === g ? (b - r) / delta + GREEN_SECTOR_START : (r - g) / delta + BLUE_SECTOR_START;
}

export function rgbToHsv({ r, g, b }: Color): Hsv {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  const s = max === 0 ? 0 : delta / max;

  if (delta === 0) {
    return { h: 0, s, v: max };
  }

  return { h: hueSector({ r, g, b, max, delta }) * HUE_SECTOR, s, v: max };
}

function hsvChannel({ h, s, v }: Hsv, offset: number): number {
  const k = (offset + h / HUE_SECTOR) % HUE_SECTORS;

  return v - v * s * Math.max(0, Math.min(k, SECTOR_RAMP_END - k, 1));
}

export function hsvToColor(hsv: Hsv, a: number): Color {
  const hue = ((hsv.h % MAX_HUE) + MAX_HUE) % MAX_HUE;
  const normalized = { h: hue, s: clampUnit(hsv.s), v: clampUnit(hsv.v) };

  return {
    r: hsvChannel(normalized, RED_OFFSET),
    g: hsvChannel(normalized, GREEN_OFFSET),
    b: hsvChannel(normalized, BLUE_OFFSET),
    a: clampUnit(a),
  };
}

export function toByte(channel: number): number {
  return Math.round(clampUnit(channel) * BYTE_MAX);
}

function hexByte(channel: number): string {
  return toByte(channel).toString(HEX_RADIX).padStart(HEX_BYTE_DIGITS, '0').toUpperCase();
}

export function colorToHex(color: Color, showAlpha: boolean): string {
  const rgb = hexByte(color.r) + hexByte(color.g) + hexByte(color.b);

  return showAlpha && toByte(color.a) < BYTE_MAX ? rgb + hexByte(color.a) : rgb;
}

export function parseHex(text: string, fallbackAlpha: number): Color | undefined {
  const digits = HEX_TEXT.exec(text.trim())?.[1];

  if (digits === undefined) {
    return undefined;
  }

  const bytes = Array.from({ length: digits.length / HEX_BYTE_DIGITS }, (_, index) =>
    Number.parseInt(
      digits.slice(index * HEX_BYTE_DIGITS, (index + 1) * HEX_BYTE_DIGITS),
      HEX_RADIX,
    ),
  );
  const [r = 0, g = 0, b = 0, a] = bytes.map((byte) => byte / BYTE_MAX);

  return { r, g, b, a: a ?? fallbackAlpha };
}

export function cssColor(color: Color): string {
  return `rgb(${String(toByte(color.r))} ${String(toByte(color.g))} ${String(toByte(color.b))} / ${String(clampUnit(color.a))})`;
}

export function cssOpaqueColor(color: Color): string {
  return cssColor({ ...color, a: OPAQUE });
}

export function cssHue(hue: number): string {
  return cssOpaqueColor(hsvToColor({ h: hue, s: 1, v: 1 }, OPAQUE));
}

export const HUE_SPECTRUM_STOPS: readonly number[] = Array.from(
  { length: HUE_SECTORS + 1 },
  (_, index) => index * HUE_SECTOR,
);

export function hueSpectrumGradient(): string {
  return `linear-gradient(to right, ${HUE_SPECTRUM_STOPS.map(cssHue).join(', ')})`;
}

export function alphaGradient(color: Color): string {
  return `linear-gradient(to right, ${cssColor({ ...color, a: 0 })}, ${cssOpaqueColor(color)})`;
}

export function saturationValueGradient(hue: number): string {
  return `linear-gradient(to top, ${cssColor({ r: 0, g: 0, b: 0, a: OPAQUE })}, transparent), linear-gradient(to right, ${cssColor({ r: 1, g: 1, b: 1, a: OPAQUE })}, ${cssHue(hue)})`;
}
