export interface RgbColor {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

export type ColorTokens = ReadonlyMap<string, string>;

const COLOR_TOKEN_PATTERN = /--color-([a-z0-9-]+)\s*:\s*([^;]+);/g;
const HEX_COLOR_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const HEX_RADIX = 16;
const CHANNEL_MAX = 255;

const SRGB_LINEAR_THRESHOLD = 0.04045;
const SRGB_LINEAR_DIVISOR = 12.92;
const SRGB_GAMMA_OFFSET = 0.055;
const SRGB_GAMMA_SCALE = 1.055;
const SRGB_GAMMA_EXPONENT = 2.4;

const LUMINANCE_RED_WEIGHT = 0.2126;
const LUMINANCE_GREEN_WEIGHT = 0.7152;
const LUMINANCE_BLUE_WEIGHT = 0.0722;
const CONTRAST_LUMINANCE_OFFSET = 0.05;

export function parseColorTokens(css: string): ColorTokens {
  const tokens = new Map<string, string>();

  for (const [, name, value] of css.matchAll(COLOR_TOKEN_PATTERN)) {
    if (name === undefined || value === undefined) {
      continue;
    }
    if (tokens.has(name)) {
      throw new Error(`Color token "${name}" is declared more than once`);
    }
    tokens.set(name, value.trim());
  }

  return tokens;
}

export function parseHexColor(value: string): RgbColor {
  const match = HEX_COLOR_PATTERN.exec(value);
  const [, red, green, blue] = match ?? [];

  if (red === undefined || green === undefined || blue === undefined) {
    throw new Error(`Expected a color in #rrggbb format, got "${value}"`);
  }

  return {
    red: Number.parseInt(red, HEX_RADIX),
    green: Number.parseInt(green, HEX_RADIX),
    blue: Number.parseInt(blue, HEX_RADIX),
  };
}

function toLinearChannel(channel: number): number {
  const normalized = channel / CHANNEL_MAX;

  if (normalized <= SRGB_LINEAR_THRESHOLD) {
    return normalized / SRGB_LINEAR_DIVISOR;
  }

  return ((normalized + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_SCALE) ** SRGB_GAMMA_EXPONENT;
}

export function relativeLuminance(color: RgbColor): number {
  return (
    LUMINANCE_RED_WEIGHT * toLinearChannel(color.red) +
    LUMINANCE_GREEN_WEIGHT * toLinearChannel(color.green) +
    LUMINANCE_BLUE_WEIGHT * toLinearChannel(color.blue)
  );
}

export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(parseHexColor(foreground));
  const backgroundLuminance = relativeLuminance(parseHexColor(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + CONTRAST_LUMINANCE_OFFSET) / (darker + CONTRAST_LUMINANCE_OFFSET);
}
