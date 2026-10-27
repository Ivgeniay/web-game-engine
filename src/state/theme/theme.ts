import { createSystemTheme } from './systemTheme';
import { createThemeStorage } from './themeStorage';
import { createThemeStore } from './themeStore';
import type { ThemeStore } from './themeStore';

export const themeStore: ThemeStore = createThemeStore({
  storage: createThemeStorage(() => window.localStorage),
  systemTheme: createSystemTheme((query) => window.matchMedia(query)),
});
