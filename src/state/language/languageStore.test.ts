import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY } from '@/core/i18n/languages';
import { createSettingStorage } from '@/state/storage/settingStorage';
import type { KeyValueStorage } from '@/state/storage/settingStorage';
import { LANGUAGE_SETTING, createLanguageStore } from './languageStore';

const GARBAGE_VALUES = ['', 'EN', 'ru-RU', 'de', '{"state":{"language":"ru"}}'];

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
  throw new Error('Storage is unavailable');
}

function createStoreOn(storage: KeyValueStorage) {
  return createLanguageStore({ storage: createSettingStorage(LANGUAGE_SETTING, () => storage) });
}

describe('createLanguageStore', () => {
  it('starts with English when nothing is saved', () => {
    expect(createStoreOn(createMemoryStorage()).getState().language).toBe(DEFAULT_LANGUAGE);
  });

  it.each(LANGUAGES)('restores the selected %s language in a new store', (language) => {
    const storage = createMemoryStorage();

    createStoreOn(storage).getState().setLanguage(language);

    expect(createStoreOn(storage).getState().language).toBe(language);
  });

  it('saves the language as a plain string under the language storage key', () => {
    const storage = createMemoryStorage();

    createStoreOn(storage).getState().setLanguage('ru');

    expect(storage.getItem(LANGUAGE_STORAGE_KEY)).toBe('ru');
  });

  it.each(GARBAGE_VALUES)('starts with English when the stored value is %j', (value) => {
    const storage = createMemoryStorage({ [LANGUAGE_STORAGE_KEY]: value });

    expect(createStoreOn(storage).getState().language).toBe(DEFAULT_LANGUAGE);
  });

  it('starts with English when the storage is unavailable', () => {
    const store = createLanguageStore({
      storage: createSettingStorage(LANGUAGE_SETTING, throwStorageError),
    });

    expect(store.getState().language).toBe(DEFAULT_LANGUAGE);
  });

  it('keeps working when saving to an unavailable storage', () => {
    const store = createLanguageStore({
      storage: createSettingStorage(LANGUAGE_SETTING, throwStorageError),
    });

    store.getState().setLanguage('ru');

    expect(store.getState().language).toBe('ru');
  });
});
