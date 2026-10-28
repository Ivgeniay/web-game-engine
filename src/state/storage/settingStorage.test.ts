import { describe, expect, it } from 'vitest';
import { createJsonSettingStorage, createSettingStorage } from './settingStorage';
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

interface WindowSize {
  readonly width: number;
  readonly height: number;
}

const JSON_SETTING_KEY = 'test-json-setting';
const JSON_GARBAGE_VALUES = ['', '{', 'null', '"text"', '{"width":"wide","height":1}'];

function isWindowSize(value: unknown): value is WindowSize {
  return (
    typeof value === 'object' &&
    value !== null &&
    'width' in value &&
    'height' in value &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
  );
}

const JSON_SETTING: SettingDefinition<WindowSize | null> = {
  key: JSON_SETTING_KEY,
  defaultValue: null,
  isValid: isWindowSize,
};

describe('createJsonSettingStorage', () => {
  it('loads the default value from an empty storage', () => {
    const storage = createMemoryStorage();

    expect(createJsonSettingStorage(JSON_SETTING, () => storage).load()).toBeNull();
  });

  it('restores a saved object in a new session', () => {
    const storage = createMemoryStorage();

    createJsonSettingStorage(JSON_SETTING, () => storage).save({ width: 800, height: 600 });

    expect(createJsonSettingStorage(JSON_SETTING, () => storage).load()).toEqual({
      width: 800,
      height: 600,
    });
    expect(storage.getItem(JSON_SETTING_KEY)).toBe('{"width":800,"height":600}');
  });

  it.each(JSON_GARBAGE_VALUES)('loads the default value when the stored value is %j', (value) => {
    const storage = createMemoryStorage({ [JSON_SETTING_KEY]: value });

    expect(createJsonSettingStorage(JSON_SETTING, () => storage).load()).toBeNull();
  });

  it('loads the default value when accessing the storage throws', () => {
    expect(createJsonSettingStorage(JSON_SETTING, unavailableStorage).load()).toBeNull();
  });

  it('does not throw on save when writing to the storage throws', () => {
    expect(() => {
      createJsonSettingStorage(JSON_SETTING, () => failingStorage).save({ width: 1, height: 1 });
    }).not.toThrow();
  });

  it('does not throw and keeps the stored value when the value cannot be serialized', () => {
    const storage = createMemoryStorage({ [JSON_SETTING_KEY]: '{"width":1,"height":1}' });
    const cyclic: { width: number; height: number; self?: unknown } = { width: 2, height: 2 };
    cyclic.self = cyclic;

    expect(() => {
      createJsonSettingStorage(JSON_SETTING, () => storage).save(cyclic);
    }).not.toThrow();
    expect(storage.getItem(JSON_SETTING_KEY)).toBe('{"width":1,"height":1}');
  });
});
