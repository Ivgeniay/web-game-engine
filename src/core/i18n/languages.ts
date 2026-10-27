export const LANGUAGES = ['en', 'ru'] as const;

export type Language = (typeof LANGUAGES)[number];

export type SourceLanguage = 'en';

export type TranslationLanguage = Exclude<Language, SourceLanguage>;

export const SOURCE_LANGUAGE: SourceLanguage = 'en';

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_STORAGE_KEY = 'editor-language';

export const PLURAL_CATEGORIES = {
  en: ['one', 'other'],
  ru: ['one', 'few', 'many', 'other'],
} as const satisfies Record<Language, readonly Intl.LDMLPluralRule[]>;

export type PluralCategory<L extends Language> = (typeof PLURAL_CATEGORIES)[L][number];

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}
