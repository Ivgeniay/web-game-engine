import type { ShowcasePage } from './showcasePage';

const HASH_PREFIX = '#';
const PATH_SEPARATOR = '/';
const EDGE_SEPARATORS_PATTERN = /^\/+|\/+$/g;

export function parseHash(hash: string): string {
  const path = hash.startsWith(HASH_PREFIX) ? hash.slice(HASH_PREFIX.length) : hash;

  return path.replace(EDGE_SEPARATORS_PATTERN, '');
}

export function pageHref(id: string): string {
  return `${HASH_PREFIX}${PATH_SEPARATOR}${id}`;
}

export function findPage(pages: readonly ShowcasePage[], id: string): ShowcasePage | undefined {
  return pages.find((page) => page.id === id);
}

export function resolvePage(
  pages: readonly ShowcasePage[],
  hash: string,
  fallbackId: string,
): ShowcasePage {
  const page = findPage(pages, parseHash(hash)) ?? findPage(pages, fallbackId);

  if (page === undefined) {
    throw new Error(`Fallback page "${fallbackId}" is not registered`);
  }

  return page;
}
