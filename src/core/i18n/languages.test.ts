import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, LANGUAGES, PLURAL_CATEGORIES, isLanguage } from './languages';

const INVALID_LANGUAGES: readonly unknown[] = ['', 'EN', 'ru-RU', 'de', null, undefined, 0, {}];

describe('PLURAL_CATEGORIES', () => {
  it.each(LANGUAGES)('matches the plural categories of Intl for %s', (language) => {
    const intlCategories = new Intl.PluralRules(language).resolvedOptions().pluralCategories;

    expect([...PLURAL_CATEGORIES[language]].sort()).toEqual([...intlCategories].sort());
  });
});

describe('isLanguage', () => {
  it.each(LANGUAGES)('accepts %s', (language) => {
    expect(isLanguage(language)).toBe(true);
  });

  it.each(INVALID_LANGUAGES)('rejects %o', (value) => {
    expect(isLanguage(value)).toBe(false);
  });
});

describe('language constants', () => {
  it('uses English as the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
  });
});
