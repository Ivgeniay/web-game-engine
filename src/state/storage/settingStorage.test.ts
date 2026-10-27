import { describe, expect, it } from 'vitest';
import { createSettingStorage } from './settingStorage';
import type { KeyValueStorage, SettingDefinition, StorageProvider } from './settingStorage';

const STORAGE_ERROR_MESSAGE = 'Storage is unavailable';
const SETTING_KEY = 'test-setting';
const SETTING_VALUES = ['first', 'second', 'third'] as const;
const GARBAGE_VALUES = ['', 'First', 'fourth', '{"value":"second"}'];

type SettingValue = (typeof SETTING_VALUES)[number];

const SETTING: SettingDefinition<SettingValue> = {
  key: SETTING_KEY,
  defaultValue: 'first',
  isValid: (value): value is SettingValue => SETTING_VALUES.some((option) => option === value),
};

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

describe('createSettingStorage', () => {
  it('loads the default value from an empty storage', () => {
    const storage = createMemoryStorage();

    expect(createSettingStorage(SETTING, () => storage).load()).toBe(SETTING.defaultValue);
  });

  it.each(SETTING_VALUES)('restores the saved %s value in a new session', (value) => {
    const storage = createMemoryStorage();

    createSettingStorage(SETTING, () => storage).save(value);

    expect(createSettingStorage(SETTING, () => storage).load()).toBe(value);
  });

  it('saves the value as a plain string under the setting key', () => {
    const storage = createMemoryStorage();

    createSettingStorage(SETTING, () => storage).save('second');

    expect(storage.getItem(SETTING_KEY)).toBe('second');
  });

  it.each(GARBAGE_VALUES)('loads the default value when the stored value is %j', (value) => {
    const storage = createMemoryStorage({ [SETTING_KEY]: value });

    expect(createSettingStorage(SETTING, () => storage).load()).toBe(SETTING.defaultValue);
  });

  it('loads the default value when accessing the storage throws', () => {
    expect(createSettingStorage(SETTING, unavailableStorage).load()).toBe(SETTING.defaultValue);
  });

  it('does not throw on save when accessing the storage throws', () => {
    expect(() => {
      createSettingStorage(SETTING, unavailableStorage).save('second');
    }).not.toThrow();
  });

  it('loads the default value when reading from the storage throws', () => {
    expect(createSettingStorage(SETTING, () => failingStorage).load()).toBe(SETTING.defaultValue);
  });

  it('does not throw on save when writing to the storage throws', () => {
    expect(() => {
      createSettingStorage(SETTING, () => failingStorage).save('second');
    }).not.toThrow();
  });
});
