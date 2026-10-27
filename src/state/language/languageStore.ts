import { createStore } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, isLanguage } from '@/core/i18n/languages';
import type { Language } from '@/core/i18n/languages';
import type { SettingDefinition, SettingStorage } from '@/state/storage/settingStorage';

export const LANGUAGE_SETTING: SettingDefinition<Language> = {
  key: LANGUAGE_STORAGE_KEY,
  defaultValue: DEFAULT_LANGUAGE,
  isValid: isLanguage,
};

export interface LanguageState {
  readonly language: Language;
  readonly setLanguage: (language: Language) => void;
}

export type LanguageStore = StoreApi<LanguageState>;

export interface LanguageStoreDependencies {
  readonly storage: SettingStorage<Language>;
}

export function createLanguageStore({ storage }: LanguageStoreDependencies): LanguageStore {
  return createStore<LanguageState>()((set) => ({
    language: storage.load(),
    setLanguage(language) {
      storage.save(language);
      set({ language });
    },
  }));
}
