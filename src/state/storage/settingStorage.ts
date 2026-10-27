export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type StorageProvider = () => KeyValueStorage;

export interface SettingDefinition<T extends string> {
  readonly key: string;
  readonly defaultValue: T;
  readonly isValid: (value: unknown) => value is T;
}

export interface SettingStorage<T extends string> {
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
      try {
        getStorage().setItem(key, value);
      } catch {
        return;
      }
    },
  };
}
