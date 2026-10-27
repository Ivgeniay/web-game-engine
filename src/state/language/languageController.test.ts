import { describe, expect, it } from 'vitest';
import { LANGUAGES } from '@/core/i18n/languages';
import type { Language } from '@/core/i18n/languages';
import { startLanguageController } from './languageController';
import type { LanguageRootElement } from './languageController';
import { createLanguageStore } from './languageStore';

function createStore(storedLanguage: Language) {
  return createLanguageStore({
    storage: {
      load: () => storedLanguage,
      save: () => undefined,
    },
  });
}

function createRoot(): LanguageRootElement {
  return { lang: '' };
}

describe('startLanguageController', () => {
  it.each(LANGUAGES)('sets the lang attribute to the stored %s language', (language) => {
    const root = createRoot();

    startLanguageController(createStore(language), root);

    expect(root.lang).toBe(language);
  });

  it('follows every language change', () => {
    const store = createStore('en');
    const root = createRoot();

    startLanguageController(store, root);
    store.getState().setLanguage('ru');

    expect(root.lang).toBe('ru');

    store.getState().setLanguage('en');

    expect(root.lang).toBe('en');
  });

  it('stops following the language after unsubscribing', () => {
    const store = createStore('en');
    const root = createRoot();

    const unsubscribe = startLanguageController(store, root);
    unsubscribe();
    store.getState().setLanguage('ru');

    expect(root.lang).toBe('en');
  });
});
