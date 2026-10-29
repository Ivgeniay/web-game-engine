import { describe, expect, it } from 'vitest';
import { LANGUAGES } from '@/core/i18n/languages';
import { translateRef } from '@/core/i18n/translate';
import { docLinkTargets, parseDocText } from '@/showcase/i18n/parseDocText';
import { OVERVIEW_PAGE_ID, SHOWCASE_PAGES } from './pages';
import { findPage, pageHref, parseHash } from './routing';
import { SHOWCASE_SECTION_IDS } from './showcasePage';

const SECTION_SEPARATOR = '/';

function pageTexts(): readonly { readonly key: string; readonly text: string }[] {
  return SHOWCASE_PAGES.flatMap((page) =>
    LANGUAGES.flatMap((language) =>
      Object.entries(page.description.messages.translations[language]).flatMap(([key, entry]) =>
        typeof entry === 'string' ? [{ key: `${page.id} ${language} ${key}`, text: entry }] : [],
      ),
    ),
  );
}

describe('SHOWCASE_PAGES', () => {
  it('has unique page ids', () => {
    const ids = SHOWCASE_PAGES.map((page) => page.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('places every page id under its section', () => {
    for (const page of SHOWCASE_PAGES) {
      const isSectionPage = page.id === page.section;
      const isNestedPage = page.id.startsWith(`${page.section}${SECTION_SEPARATOR}`);

      expect(isSectionPage || isNestedPage, page.id).toBe(true);
    }
  });

  it('has page ids that survive the hash address round trip', () => {
    for (const page of SHOWCASE_PAGES) {
      expect(parseHash(pageHref(page.id))).toBe(page.id);
    }
  });

  it('registers the overview page in the overview section', () => {
    expect(findPage(SHOWCASE_PAGES, OVERVIEW_PAGE_ID)?.section).toBe('overview');
  });

  it('has at least one page in every section', () => {
    const sectionsWithPages = new Set(SHOWCASE_PAGES.map((page) => page.section));

    for (const section of SHOWCASE_SECTION_IDS) {
      expect(sectionsWithPages.has(section), section).toBe(true);
    }
  });

  it('has page titles without documentation markup in every language', () => {
    for (const page of SHOWCASE_PAGES) {
      for (const language of LANGUAGES) {
        const title = translateRef(page.title, language);

        expect(parseDocText(title), `${page.id} ${language}`).toEqual([
          { kind: 'text', text: title },
        ]);
      }
    }
  });

  it('links documentation texts only to registered pages', () => {
    const pageIds = new Set(SHOWCASE_PAGES.map((page) => page.id));

    for (const { key, text } of pageTexts()) {
      for (const target of docLinkTargets(parseDocText(text))) {
        expect(pageIds.has(target), `${key}: ${target}`).toBe(true);
      }
    }
  });
});
