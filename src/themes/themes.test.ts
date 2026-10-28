import { describe, expect, it } from 'vitest';
import { contrastRatio, parseColorTokens } from './contrast';
import type { ColorTokens } from './contrast';
import { CONTRAST_PAIRS, MIN_CONTRAST_BY_KIND } from './contrastPairs';
import type { ContrastPair } from './contrastPairs';
import darkCss from './dark.css?raw';
import lightCss from './light.css?raw';

interface ThemeSource {
  readonly name: string;
  readonly tokens: ColorTokens;
}

interface ContrastCase extends ContrastPair {
  readonly theme: ThemeSource;
}

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
  'overlay-backdrop',
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
  'accent-active',
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
    '$theme.name: $kind $foreground on $background meets the contrast threshold',
    ({ theme, foreground, background, kind }) => {
      const minContrast = MIN_CONTRAST_BY_KIND[kind];
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
