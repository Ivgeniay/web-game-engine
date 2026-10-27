import { useStore } from 'zustand';
import { useEditorStores } from '@/state/stores/storesContext';
import type { LanguageState } from './languageStore';

export function useLanguageStore<Selected>(selector: (state: LanguageState) => Selected): Selected {
  return useStore(useEditorStores().language, selector);
}
