import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY, isThemeMode } from './themeMode';
import type { ThemeMode } from './themeMode';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type StorageProvider = () => KeyValueStorage;

export interface ThemeStorage {
  loadThemeMode(): ThemeMode;
  saveThemeMode(mode: ThemeMode): void;
}

function readStoredValue(getStorage: StorageProvider): string | null {
  try {
    return getStorage().getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function createThemeStorage(getStorage: StorageProvider): ThemeStorage {
  return {
    loadThemeMode() {
      const storedValue = readStoredValue(getStorage);

      return isThemeMode(storedValue) ? storedValue : DEFAULT_THEME_MODE;
    },

    saveThemeMode(mode) {
      try {
        getStorage().setItem(THEME_STORAGE_KEY, mode);
      } catch {
        return;
      }
    },
  };
}
