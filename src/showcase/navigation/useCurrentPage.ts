import { useEffect, useSyncExternalStore } from 'react';
import { OVERVIEW_PAGE_ID, SHOWCASE_PAGES } from './pages';
import { pageHref, resolvePage } from './routing';
import type { ShowcasePage } from './showcasePage';

const HASH_CHANGE_EVENT = 'hashchange';

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener(HASH_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener(HASH_CHANGE_EVENT, onChange);
  };
}

function getHash(): string {
  return window.location.hash;
}

export function useCurrentPage(): ShowcasePage {
  const hash = useSyncExternalStore(subscribeToHash, getHash);
  const page = resolvePage(SHOWCASE_PAGES, hash, OVERVIEW_PAGE_ID);
  const canonicalHash = pageHref(page.id);

  useEffect(() => {
    if (hash !== canonicalHash) {
      window.history.replaceState(window.history.state, '', canonicalHash);
    }
  }, [hash, canonicalHash]);

  return page;
}
