import type { ResolvedTheme } from '@/state/theme/themeMode';
import { contrastRatio, parseColorTokens } from '@/themes/contrast';
import type { ColorTokens } from '@/themes/contrast';
import { CONTRAST_PAIRS, MIN_CONTRAST_BY_KIND } from '@/themes/contrastPairs';
import type { ContrastPair } from '@/themes/contrastPairs';
import darkCss from '@/themes/dark.css?raw';
import lightCss from '@/themes/light.css?raw';

export interface ContrastRow extends ContrastPair {
  readonly ratio: number;
  readonly minContrast: number;
  readonly passes: boolean;
}

const THEME_COLOR_TOKENS: Readonly<Record<ResolvedTheme, ColorTokens>> = {
  dark: parseColorTokens(darkCss),
  light: parseColorTokens(lightCss),
};

function getColor(tokens: ColorTokens, name: string): string {
  const value = tokens.get(name);

  if (value === undefined) {
    throw new Error(`Color token "${name}" is missing`);
  }

  return value;
}

export function getContrastRows(theme: ResolvedTheme): ContrastRow[] {
  const tokens = THEME_COLOR_TOKENS[theme];

  return CONTRAST_PAIRS.map((pair) => {
    const ratio = contrastRatio(
      getColor(tokens, pair.foreground),
      getColor(tokens, pair.background),
    );
    const minContrast = MIN_CONTRAST_BY_KIND[pair.kind];

    return { ...pair, ratio, minContrast, passes: ratio >= minContrast };
  });
}
