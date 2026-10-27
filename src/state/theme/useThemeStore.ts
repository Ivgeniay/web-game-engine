import { useStore } from 'zustand';
import { useEditorStores } from '@/state/stores/storesContext';
import type { ThemeState } from './themeStore';

export function useThemeStore<Selected>(selector: (state: ThemeState) => Selected): Selected {
  return useStore(useEditorStores().theme, selector);
}
