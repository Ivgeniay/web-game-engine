import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import type { SearchableMenuLabels } from '@/ui/searchableMenu/SearchableMenu';
import { searchableMenuMessages } from './searchableMenuMessages';

export function useSearchableMenuLabels(): SearchableMenuLabels {
  const t = useMessages(searchableMenuMessages);

  return useMemo(
    () => ({ search: t('search'), clearSearch: t('clearSearch'), back: t('back') }),
    [t],
  );
}
