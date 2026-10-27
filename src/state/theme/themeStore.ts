import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import { resolveTheme } from './themeMode';
import type { ResolvedTheme, ThemeMode } from './themeMode';
import type { SystemTheme, Unsubscribe } from './systemTheme';
import type { ThemeStorage } from './themeStorage';

export interface ThemeState {
  readonly mode: ThemeMode;
  readonly resolvedTheme: ResolvedTheme;
  readonly setMode: (mode: ThemeMode) => void;
}

export type ThemeStore = StoreApi<ThemeState>;

export interface ThemeStoreDependencies {
  readonly storage: ThemeStorage;
  readonly systemTheme: SystemTheme;
}

export function createThemeStore({ storage, systemTheme }: ThemeStoreDependencies): ThemeStore {
  return createStore<ThemeState>()((set) => {
    let unsubscribeFromSystem: Unsubscribe | null = null;

    function followSystemTheme(mode: ThemeMode): void {
      if (mode === 'system' && unsubscribeFromSystem === null) {
        unsubscribeFromSystem = systemTheme.subscribe((prefersLight) => {
          set({ resolvedTheme: resolveTheme('system', prefersLight) });
        });
        return;
      }

      if (mode !== 'system' && unsubscribeFromSystem !== null) {
        unsubscribeFromSystem();
        unsubscribeFromSystem = null;
      }
    }

    const initialMode = storage.loadThemeMode();
    followSystemTheme(initialMode);

    return {
      mode: initialMode,
      resolvedTheme: resolveTheme(initialMode, systemTheme.prefersLight()),
      setMode(mode) {
        storage.saveThemeMode(mode);
        set({ mode, resolvedTheme: resolveTheme(mode, systemTheme.prefersLight()) });
        followSystemTheme(mode);
      },
    };
  });
}
