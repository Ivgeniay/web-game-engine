import { describe, expect, it } from 'vitest';
import { createSettingStorage } from '@/state/storage/settingStorage';
import type { SettingStorage } from '@/state/storage/settingStorage';
import { DEFAULT_THEME_MODE, RESOLVED_THEMES, THEME_MODE_SETTING } from './themeMode';
import type { ThemeMode } from './themeMode';
import type { SystemTheme, SystemThemeListener } from './systemTheme';
import { createThemeStore } from './themeStore';

interface FakeThemeStorage extends SettingStorage<ThemeMode> {
  readonly savedModes: readonly ThemeMode[];
}

interface FakeSystemTheme extends SystemTheme {
  readonly subscriptionCount: number;
  change(prefersLight: boolean): void;
}

function createFakeThemeStorage(storedMode: ThemeMode = DEFAULT_THEME_MODE): FakeThemeStorage {
  let currentMode = storedMode;
  const savedModes: ThemeMode[] = [];

  return {
    savedModes,
    load: () => currentMode,
    save: (mode) => {
      currentMode = mode;
      savedModes.push(mode);
    },
  };
}

function createFakeSystemTheme(initialPrefersLight: boolean): FakeSystemTheme {
  let prefersLight = initialPrefersLight;
  const listeners = new Set<SystemThemeListener>();

  return {
    get subscriptionCount() {
      return listeners.size;
    },
    prefersLight: () => prefersLight,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    change(nextPrefersLight) {
      prefersLight = nextPrefersLight;
      for (const listener of listeners) {
        listener(nextPrefersLight);
      }
    },
  };
}

function throwStorageError(): never {
  throw new Error('Storage is unavailable');
}

describe('createThemeStore', () => {
  it.each(RESOLVED_THEMES)('starts with the stored %s mode', (mode) => {
    const store = createThemeStore({
      storage: createFakeThemeStorage(mode),
      systemTheme: createFakeSystemTheme(mode === 'dark'),
    });

    expect(store.getState().mode).toBe(mode);
    expect(store.getState().resolvedTheme).toBe(mode);
  });

  it.each([
    { prefersLight: true, resolvedTheme: 'light' },
    { prefersLight: false, resolvedTheme: 'dark' },
  ])(
    'resolves the stored system mode to $resolvedTheme when the system prefers light is $prefersLight',
    ({ prefersLight, resolvedTheme }) => {
      const store = createThemeStore({
        storage: createFakeThemeStorage('system'),
        systemTheme: createFakeSystemTheme(prefersLight),
      });

      expect(store.getState().mode).toBe('system');
      expect(store.getState().resolvedTheme).toBe(resolvedTheme);
    },
  );

  it('starts with the dark theme when the storage is unavailable', () => {
    const store = createThemeStore({
      storage: createSettingStorage(THEME_MODE_SETTING, throwStorageError),
      systemTheme: createFakeSystemTheme(true),
    });

    expect(store.getState().mode).toBe('dark');
    expect(store.getState().resolvedTheme).toBe('dark');
  });

  it('keeps working when saving to an unavailable storage', () => {
    const store = createThemeStore({
      storage: createSettingStorage(THEME_MODE_SETTING, throwStorageError),
      systemTheme: createFakeSystemTheme(false),
    });

    store.getState().setMode('light');

    expect(store.getState().mode).toBe('light');
    expect(store.getState().resolvedTheme).toBe('light');
  });

  it('saves every selected mode', () => {
    const storage = createFakeThemeStorage();
    const store = createThemeStore({ storage, systemTheme: createFakeSystemTheme(false) });

    store.getState().setMode('light');
    store.getState().setMode('system');
    store.getState().setMode('dark');

    expect(storage.savedModes).toEqual(['light', 'system', 'dark']);
  });

  it('restores the selected mode in a new store', () => {
    const storage = createFakeThemeStorage();
    const systemTheme = createFakeSystemTheme(false);

    createThemeStore({ storage, systemTheme }).getState().setMode('light');

    expect(createThemeStore({ storage, systemTheme }).getState().mode).toBe('light');
  });

  it('resolves the system mode from the current system preference when selected', () => {
    const store = createThemeStore({
      storage: createFakeThemeStorage('dark'),
      systemTheme: createFakeSystemTheme(true),
    });

    store.getState().setMode('system');

    expect(store.getState().resolvedTheme).toBe('light');
  });

  it('follows system preference changes in the system mode', () => {
    const systemTheme = createFakeSystemTheme(false);
    const store = createThemeStore({ storage: createFakeThemeStorage('system'), systemTheme });

    systemTheme.change(true);

    expect(store.getState().resolvedTheme).toBe('light');

    systemTheme.change(false);

    expect(store.getState().resolvedTheme).toBe('dark');
  });

  it('ignores system preference changes after leaving the system mode', () => {
    const systemTheme = createFakeSystemTheme(false);
    const store = createThemeStore({ storage: createFakeThemeStorage('system'), systemTheme });

    store.getState().setMode('dark');
    systemTheme.change(true);

    expect(store.getState().mode).toBe('dark');
    expect(store.getState().resolvedTheme).toBe('dark');
  });

  it('does not subscribe to the system preference outside the system mode', () => {
    const systemTheme = createFakeSystemTheme(false);

    createThemeStore({ storage: createFakeThemeStorage('light'), systemTheme });

    expect(systemTheme.subscriptionCount).toBe(0);
  });

  it('subscribes exactly once when created in the system mode', () => {
    const systemTheme = createFakeSystemTheme(false);

    createThemeStore({ storage: createFakeThemeStorage('system'), systemTheme });

    expect(systemTheme.subscriptionCount).toBe(1);
  });

  it('keeps a single subscription when the system mode is selected again', () => {
    const systemTheme = createFakeSystemTheme(false);
    const store = createThemeStore({ storage: createFakeThemeStorage('system'), systemTheme });

    store.getState().setMode('system');
    store.getState().setMode('system');

    expect(systemTheme.subscriptionCount).toBe(1);
  });

  it('subscribes only while the system mode is active', () => {
    const systemTheme = createFakeSystemTheme(false);
    const store = createThemeStore({ storage: createFakeThemeStorage('dark'), systemTheme });
    const transitions: readonly ThemeMode[] = ['system', 'light', 'system', 'dark'];

    const subscriptionCounts = transitions.map((mode) => {
      store.getState().setMode(mode);
      return systemTheme.subscriptionCount;
    });

    expect(subscriptionCounts).toEqual([1, 0, 1, 0]);
  });
});
