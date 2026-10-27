import type { SettingDefinition } from '@/state/storage/settingStorage';

export const RESOLVED_THEMES = ['dark', 'light'] as const;

export type ResolvedTheme = (typeof RESOLVED_THEMES)[number];

export const THEME_MODES = [...RESOLVED_THEMES, 'system'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const THEME_STORAGE_KEY = 'editor-theme-mode';

export const DEFAULT_THEME_MODE: ThemeMode = 'dark';

export function isThemeMode(value: unknown): value is ThemeMode {
  return THEME_MODES.some((mode) => mode === value);
}

export const THEME_MODE_SETTING: SettingDefinition<ThemeMode> = {
  key: THEME_STORAGE_KEY,
  defaultValue: DEFAULT_THEME_MODE,
  isValid: isThemeMode,
};

export function resolveTheme(mode: ThemeMode, systemPrefersLight: boolean): ResolvedTheme {
  if (mode !== 'system') {
    return mode;
  }

  return systemPrefersLight ? 'light' : 'dark';
}
