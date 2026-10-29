import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import type { ListEditorLabels } from '@/ui/listEditor/ListEditor';
import { listEditorMessages } from './listEditorMessages';
import { useNumberFieldMessages } from './useNumberFieldMessages';

const MIN_SIZE = 0;

export function useListEditorLabels(): ListEditorLabels {
  const t = useMessages(listEditorMessages);
  const sizeMessages = useNumberFieldMessages({ min: MIN_SIZE });

  return useMemo(
    () => ({
      size: t('size'),
      add: t('add'),
      empty: t('empty'),
      itemLabel: (index: number) => t('itemLabel', { index: String(index) }),
      moveItem: (index: number) => t('moveItem', { index: String(index) }),
      removeItem: (index: number) => t('removeItem', { index: String(index) }),
      sizeMessages,
    }),
    [t, sizeMessages],
  );
}
