import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME_MODE,
  RESOLVED_THEMES,
  THEME_MODES,
  isThemeMode,
  resolveTheme,
} from './themeMode';

const INVALID_THEME_MODES: readonly unknown[] = [
  '',
  'Dark',
  ' light',
  'auto',
  null,
  undefined,
  0,
  {},
];

describe('resolveTheme', () => {
  it.each(RESOLVED_THEMES)('keeps the explicit %s mode regardless of the system', (theme) => {
    expect(resolveTheme(theme, true)).toBe(theme);
    expect(resolveTheme(theme, false)).toBe(theme);
  });

  it('resolves the system mode to light when the system prefers light', () => {
    expect(resolveTheme('system', true)).toBe('light');
  });

  it('resolves the system mode to dark when the system does not prefer light', () => {
    expect(resolveTheme('system', false)).toBe('dark');
  });
});

describe('isThemeMode', () => {
  it.each(THEME_MODES)('accepts %s', (mode) => {
    expect(isThemeMode(mode)).toBe(true);
  });

  it.each(INVALID_THEME_MODES)('rejects %o', (value) => {
    expect(isThemeMode(value)).toBe(false);
  });
});

describe('theme mode constants', () => {
  it('includes every resolved theme in the theme modes', () => {
    expect(THEME_MODES).toEqual(expect.arrayContaining([...RESOLVED_THEMES]));
  });

  it('uses dark as the default mode', () => {
    expect(DEFAULT_THEME_MODE).toBe('dark');
  });
});
