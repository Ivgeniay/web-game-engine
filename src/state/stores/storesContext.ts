import { createContext, useContext } from 'react';
import type { LanguageStore } from '@/state/language/languageStore';
import type { ThemeStore } from '@/state/theme/themeStore';

export interface EditorStores {
  readonly theme: ThemeStore;
  readonly language: LanguageStore;
}

export const StoresContext = createContext<EditorStores | null>(null);

export function useEditorStores(): EditorStores {
  const stores = useContext(StoresContext);

  if (stores === null) {
    throw new Error('Editor stores are not provided. Wrap the tree in StoresProvider.');
  }

  return stores;
}
