import type { Platform } from '@/core/hotkeys/platform';
import type { Language } from '@/core/i18n/languages';
import { LANGUAGE_SETTING, createLanguageStore } from '@/state/language/languageStore';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { createSettingStorage } from '@/state/storage/settingStorage';
import type { KeyValueStorage } from '@/state/storage/settingStorage';
import type { EditorStores } from '@/state/stores/storesContext';
import { createSystemTheme } from '@/state/theme/systemTheme';
import { THEME_MODE_SETTING } from '@/state/theme/themeMode';
import { createThemeStore } from '@/state/theme/themeStore';

export interface TestEditor {
  readonly stores: EditorStores;
  readonly registries: EditorRegistries;
  readonly platform: Platform;
}

function createMemoryStorage(): KeyValueStorage {
  const entries = new Map<string, string>();

  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
}

const darkSystemTheme = createSystemTheme(() => ({
  matches: false,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
}));

export function createTestEditor(
  platform: Platform = 'other',
  language: Language = 'en',
): TestEditor {
  const storage = createMemoryStorage();
  const stores: EditorStores = {
    theme: createThemeStore({
      storage: createSettingStorage(THEME_MODE_SETTING, () => storage),
      systemTheme: darkSystemTheme,
    }),
    language: createLanguageStore({
      storage: createSettingStorage(LANGUAGE_SETTING, () => storage),
    }),
  };
  stores.language.getState().setLanguage(language);

  return { stores, registries: createEditorRegistries(), platform };
}
