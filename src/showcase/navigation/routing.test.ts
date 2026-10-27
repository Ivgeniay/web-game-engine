import { describe, expect, it } from 'vitest';
import { findPage, pageHref, parseHash, resolvePage } from './routing';
import type { ShowcasePage } from './showcasePage';

function EmptyPage() {
  return null;
}

function createPage(id: string): ShowcasePage {
  return { id, section: 'overview', title: id, description: id, component: EmptyPage };
}

const FALLBACK_ID = 'overview';
const NESTED_ID = 'overview/details';

const PAGES: readonly ShowcasePage[] = [createPage(FALLBACK_ID), createPage(NESTED_ID)];

const EMPTY_HASHES = ['', '#', '#/', '#//'];

describe('parseHash', () => {
  it('returns an empty path for empty hashes', () => {
    for (const hash of EMPTY_HASHES) {
      expect(parseHash(hash)).toBe('');
    }
  });

  it('strips the hash prefix and the leading separator', () => {
    expect(parseHash('#/overview/details')).toBe(NESTED_ID);
  });

  it('strips trailing separators', () => {
    expect(parseHash('#/overview/details/')).toBe(NESTED_ID);
    expect(parseHash('#/overview/details//')).toBe(NESTED_ID);
  });

  it('accepts a path without the hash prefix', () => {
    expect(parseHash('/overview/details')).toBe(NESTED_ID);
  });

  it('round-trips with pageHref', () => {
    expect(parseHash(pageHref(NESTED_ID))).toBe(NESTED_ID);
  });
});

describe('pageHref', () => {
  it('builds a hash address from a page id', () => {
    expect(pageHref(NESTED_ID)).toBe('#/overview/details');
  });
});

describe('findPage', () => {
  it('finds a registered page by id', () => {
    expect(findPage(PAGES, NESTED_ID)?.id).toBe(NESTED_ID);
  });

  it('returns undefined for an unknown id', () => {
    expect(findPage(PAGES, 'missing')).toBeUndefined();
  });
});

describe('resolvePage', () => {
  it('resolves a known address to its page', () => {
    expect(resolvePage(PAGES, '#/overview/details', FALLBACK_ID).id).toBe(NESTED_ID);
  });

  it('resolves an unknown address to the fallback page', () => {
    expect(resolvePage(PAGES, '#/missing/page', FALLBACK_ID).id).toBe(FALLBACK_ID);
  });

  it('resolves an empty address to the fallback page', () => {
    for (const hash of EMPTY_HASHES) {
      expect(resolvePage(PAGES, hash, FALLBACK_ID).id).toBe(FALLBACK_ID);
    }
  });

  it('throws when the fallback page is not registered', () => {
    expect(() => resolvePage(PAGES, '#/missing', 'absent')).toThrow(
      'Fallback page "absent" is not registered',
    );
  });
});
