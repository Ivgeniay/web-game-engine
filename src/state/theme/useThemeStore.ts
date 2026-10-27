import { useStore } from 'zustand';
import { themeStore } from './theme';
import type { ThemeState } from './themeStore';

export function useThemeStore<Selected>(selector: (state: ThemeState) => Selected): Selected {
  return useStore(themeStore, selector);
}
