import { describe, expect, it } from 'vitest';
import { OVERVIEW_PAGE_ID, SHOWCASE_PAGES } from './pages';
import { findPage, pageHref, parseHash } from './routing';
import { SHOWCASE_SECTION_IDS } from './showcasePage';

const SECTION_SEPARATOR = '/';

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
});
