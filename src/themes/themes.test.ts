import { describe, expect, it } from 'vitest';
import { contrastRatio, parseColorTokens } from './contrast';
import type { ColorTokens } from './contrast';
import darkCss from './dark.css?raw';
import lightCss from './light.css?raw';

interface ThemeSource {
  readonly name: string;
  readonly tokens: ColorTokens;
}

interface ContrastPair {
  readonly foreground: string;
  readonly background: string;
  readonly minContrast: number;
}

interface ContrastCase extends ContrastPair {
  readonly theme: ThemeSource;
}

const TEXT_MIN_CONTRAST = 4.5;
const NON_TEXT_MIN_CONTRAST = 3;

const THEMES: readonly ThemeSource[] = [
  { name: 'dark', tokens: parseColorTokens(darkCss) },
  { name: 'light', tokens: parseColorTokens(lightCss) },
];

const EXPECTED_TOKEN_NAMES: readonly string[] = [
  'bg-app',
  'bg-panel',
  'bg-header',
  'bg-control',
  'bg-field',
  'bg-popup',
  'overlay-hover',
  'overlay-active',
  'bg-selection',
  'bg-selection-inactive',
  'border-separator',
  'border-control',
  'border-focus',
  'text-primary',
  'text-secondary',
  'text-disabled',
  'text-on-accent',
  'accent',
  'accent-hover',
  'status-error',
  'status-warning',
  'status-success',
  'status-info',
  'playmode-tint',
  'axis-x',
  'axis-y',
  'axis-z',
  'scrollbar-thumb',
  'scrollbar-track',
  'shadow',
];

const SURFACE_BACKGROUNDS = ['bg-panel', 'bg-header', 'bg-field', 'bg-popup'];
const TEXT_ON_SURFACES = ['text-primary', 'text-secondary'];
const SELECTION_BACKGROUNDS = ['bg-selection', 'bg-selection-inactive'];
const ACCENT_BACKGROUNDS = ['accent', 'accent-hover'];
const NON_TEXT_ON_SURFACES = [
  'status-error',
  'status-warning',
  'status-success',
  'status-info',
  'border-focus',
];

function combinePairs(
  foregrounds: readonly string[],
  backgrounds: readonly string[],
  minContrast: number,
): ContrastPair[] {
  return foregrounds.flatMap((foreground) =>
    backgrounds.map((background) => ({ foreground, background, minContrast })),
  );
}

const CONTRAST_PAIRS: readonly ContrastPair[] = [
  ...combinePairs(TEXT_ON_SURFACES, SURFACE_BACKGROUNDS, TEXT_MIN_CONTRAST),
  ...combinePairs(['text-primary'], SELECTION_BACKGROUNDS, TEXT_MIN_CONTRAST),
  ...combinePairs(['text-on-accent'], ACCENT_BACKGROUNDS, TEXT_MIN_CONTRAST),
  ...combinePairs(NON_TEXT_ON_SURFACES, SURFACE_BACKGROUNDS, NON_TEXT_MIN_CONTRAST),
];

const CONTRAST_CASES: readonly ContrastCase[] = THEMES.flatMap((theme) =>
  CONTRAST_PAIRS.map((pair) => ({ ...pair, theme })),
);

function sortedNames(tokens: ColorTokens): string[] {
  return [...tokens.keys()].sort();
}

function getToken(theme: ThemeSource, name: string): string {
  const value = theme.tokens.get(name);

  if (value === undefined) {
    throw new Error(`Token "${name}" is missing in theme "${theme.name}"`);
  }

  return value;
}

describe('theme token sets', () => {
  it.each(THEMES)('$name theme declares exactly the expected tokens', (theme) => {
    expect(sortedNames(theme.tokens)).toEqual([...EXPECTED_TOKEN_NAMES].sort());
  });

  it('dark and light themes declare the same tokens', () => {
    const [darkTheme, lightTheme] = THEMES;

    expect(darkTheme).toBeDefined();
    expect(lightTheme).toBeDefined();
    expect(sortedNames(darkTheme?.tokens ?? new Map())).toEqual(
      sortedNames(lightTheme?.tokens ?? new Map()),
    );
  });
});

describe('theme contrast', () => {
  it.each(CONTRAST_CASES)(
    '$theme.name: $foreground on $background is at least $minContrast',
    ({ theme, foreground, background, minContrast }) => {
      const foregroundValue = getToken(theme, foreground);
      const backgroundValue = getToken(theme, background);
      const ratio = contrastRatio(foregroundValue, backgroundValue);

      expect(
        ratio,
        `${foreground} ${foregroundValue} on ${background} ${backgroundValue}: ${ratio.toFixed(2)}`,
      ).toBeGreaterThanOrEqual(minContrast);
    },
  );
});
