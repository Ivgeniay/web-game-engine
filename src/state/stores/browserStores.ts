import { createLanguageStore, LANGUAGE_SETTING } from '@/state/language/languageStore';
import { createSettingStorage } from '@/state/storage/settingStorage';
import type { StorageProvider } from '@/state/storage/settingStorage';
import { createSystemTheme } from '@/state/theme/systemTheme';
import { THEME_MODE_SETTING } from '@/state/theme/themeMode';
import { createThemeStore } from '@/state/theme/themeStore';
import type { EditorStores } from './storesContext';

export const browserStorage: StorageProvider = () => window.localStorage;

export function createBrowserStores(): EditorStores {
  return {
    theme: createThemeStore({
      storage: createSettingStorage(THEME_MODE_SETTING, browserStorage),
      systemTheme: createSystemTheme((query) => window.matchMedia(query)),
    }),
    language: createLanguageStore({
      storage: createSettingStorage(LANGUAGE_SETTING, browserStorage),
    }),
  };
}
