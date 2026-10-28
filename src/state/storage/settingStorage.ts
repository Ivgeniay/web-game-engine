export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type StorageProvider = () => KeyValueStorage;

export interface SettingDefinition<T> {
  readonly key: string;
  readonly defaultValue: T;
  readonly isValid: (value: unknown) => value is T;
}

export interface SettingStorage<T> {
  load(): T;
  save(value: T): void;
}

function readStoredValue(getStorage: StorageProvider, key: string): string | null {
  try {
    return getStorage().getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(getStorage: StorageProvider, key: string, value: string): void {
  try {
    getStorage().setItem(key, value);
  } catch {
    return;
  }
}

function parseJson(text: string | null): unknown {
  if (text === null) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function stringifyJson(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function createSettingStorage<T extends string>(
  { key, defaultValue, isValid }: SettingDefinition<T>,
  getStorage: StorageProvider,
): SettingStorage<T> {
  return {
    load() {
      const storedValue = readStoredValue(getStorage, key);

      return isValid(storedValue) ? storedValue : defaultValue;
    },

    save(value) {
      writeStoredValue(getStorage, key, value);
    },
  };
}

export function createJsonSettingStorage<T>(
  { key, defaultValue, isValid }: SettingDefinition<T>,
  getStorage: StorageProvider,
): SettingStorage<T> {
  return {
    load() {
      const storedValue = parseJson(readStoredValue(getStorage, key));

      return isValid(storedValue) ? storedValue : defaultValue;
    },

    save(value) {
      const text = stringifyJson(value);

      if (text !== null) {
        writeStoredValue(getStorage, key, text);
      }
    },
  };
}
