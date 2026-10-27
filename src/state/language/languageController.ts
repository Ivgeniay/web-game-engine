import type { Unsubscribe } from '@/core/unsubscribe';
import type { LanguageStore } from './languageStore';

export interface LanguageRootElement {
  lang: string;
}

export function startLanguageController(
  store: LanguageStore,
  root: LanguageRootElement,
): Unsubscribe {
  root.lang = store.getState().language;

  return store.subscribe((state) => {
    root.lang = state.language;
  });
}
