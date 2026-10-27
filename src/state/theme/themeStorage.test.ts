import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_MODE, THEME_MODES, THEME_STORAGE_KEY } from './themeMode';
import { createThemeStorage } from './themeStorage';
import type { KeyValueStorage, StorageProvider } from './themeStorage';

const STORAGE_ERROR_MESSAGE = 'Storage is unavailable';
const GARBAGE_VALUES = ['', 'Dark', 'auto', '{"state":{"mode":"light"}}'];

function createMemoryStorage(initialEntries: Record<string, string> = {}): KeyValueStorage {
  const entries = new Map(Object.entries(initialEntries));

  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
}

function throwStorageError(): never {
  throw new Error(STORAGE_ERROR_MESSAGE);
}

const unavailableStorage: StorageProvider = throwStorageError;

const failingStorage: KeyValueStorage = {
  getItem: throwStorageError,
  setItem: throwStorageError,
};

describe('createThemeStorage', () => {
  it('loads the default mode from an empty storage', () => {
    const storage = createMemoryStorage();

    expect(createThemeStorage(() => storage).loadThemeMode()).toBe(DEFAULT_THEME_MODE);
  });

  it.each(THEME_MODES)('restores the saved %s mode in a new session', (mode) => {
    const storage = createMemoryStorage();

    createThemeStorage(() => storage).saveThemeMode(mode);

    expect(createThemeStorage(() => storage).loadThemeMode()).toBe(mode);
  });

  it('saves the mode as a plain string under the theme storage key', () => {
    const storage = createMemoryStorage();

    createThemeStorage(() => storage).saveThemeMode('light');

    expect(storage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it.each(GARBAGE_VALUES)('loads the default mode when the stored value is %j', (value) => {
    const storage = createMemoryStorage({ [THEME_STORAGE_KEY]: value });

    expect(createThemeStorage(() => storage).loadThemeMode()).toBe(DEFAULT_THEME_MODE);
  });

  it('loads the default mode when accessing the storage throws', () => {
    expect(createThemeStorage(unavailableStorage).loadThemeMode()).toBe(DEFAULT_THEME_MODE);
  });

  it('does not throw on save when accessing the storage throws', () => {
    expect(() => {
      createThemeStorage(unavailableStorage).saveThemeMode('light');
    }).not.toThrow();
  });

  it('loads the default mode when reading from the storage throws', () => {
    expect(createThemeStorage(() => failingStorage).loadThemeMode()).toBe(DEFAULT_THEME_MODE);
  });

  it('does not throw on save when writing to the storage throws', () => {
    expect(() => {
      createThemeStorage(() => failingStorage).saveThemeMode('light');
    }).not.toThrow();
  });
});
