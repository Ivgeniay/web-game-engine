import { describe, expect, it } from 'vitest';
import {
  TOKEN_GROUPS,
  getTokenGroup,
  groupTokenNames,
  parseCustomPropertyNames,
} from './customProperties';
import darkCss from './dark.css?raw';
import lightCss from './light.css?raw';
import tokensCss from './tokens.css?raw';

const SAMPLE_CSS = `
:root {
  --space-4: 4px;
  --shadow-popup: 0 4px 12px var(--color-shadow);
  --duration-fast: 80ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
  }
}
`;

describe('parseCustomPropertyNames', () => {
  it('returns declared names in declaration order without duplicates', () => {
    expect(parseCustomPropertyNames(SAMPLE_CSS)).toEqual([
      '--space-4',
      '--shadow-popup',
      '--duration-fast',
    ]);
  });

  it('ignores properties that are only referenced through var()', () => {
    expect(parseCustomPropertyNames(SAMPLE_CSS)).not.toContain('--color-shadow');
  });
});

describe('getTokenGroup', () => {
  it.each([
    ['--color-bg-app', 'color'],
    ['--font-size-md', 'font'],
    ['--space-12', 'space'],
    ['--size-control-height-md', 'size'],
    ['--radius-full', 'radius'],
    ['--shadow-tooltip', 'shadow'],
    ['--z-modal', 'z'],
    ['--duration-normal', 'duration'],
    ['--easing-standard', 'easing'],
  ])('puts %s into the %s group', (name, group) => {
    expect(getTokenGroup(name)).toBe(group);
  });

  it.each(['--gray-850', '--colorful-thing', '--zebra-1', 'color-bg-app'])(
    'throws on %s',
    (name) => {
      expect(() => getTokenGroup(name)).toThrow(name);
    },
  );
});

describe('groupTokenNames', () => {
  it('groups names by prefix and keeps their order', () => {
    const grouped = groupTokenNames(['--space-4', '--color-accent', '--space-2']);

    expect(grouped.space).toEqual(['--space-4', '--space-2']);
    expect(grouped.color).toEqual(['--color-accent']);
    expect(grouped.radius).toEqual([]);
  });

  it('returns every group', () => {
    expect(Object.keys(groupTokenNames([]))).toEqual([...TOKEN_GROUPS]);
  });
});

describe('theme files', () => {
  it('declare only tokens with known group prefixes', () => {
    for (const css of [tokensCss, darkCss, lightCss]) {
      expect(() => groupTokenNames(parseCustomPropertyNames(css))).not.toThrow();
    }
  });

  it('keep color tokens in the theme files only', () => {
    expect(groupTokenNames(parseCustomPropertyNames(tokensCss)).color).toEqual([]);

    for (const css of [darkCss, lightCss]) {
      const names = parseCustomPropertyNames(css);

      expect(groupTokenNames(names).color).toEqual(names);
    }
  });

  it('cover every token group', () => {
    const grouped = groupTokenNames([
      ...parseCustomPropertyNames(tokensCss),
      ...parseCustomPropertyNames(darkCss),
    ]);

    for (const group of TOKEN_GROUPS) {
      expect(grouped[group], group).not.toHaveLength(0);
    }
  });
});
