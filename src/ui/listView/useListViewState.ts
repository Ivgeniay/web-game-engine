import { useState } from 'react';
import type { ListSelectionProps } from './useListInteraction';

export interface ListViewInitialState {
  readonly selectedIds?: readonly string[];
  readonly focusedId?: string | null;
}

const NO_SELECTION: readonly string[] = [];

export function useListViewState(initial: ListViewInitialState = {}): ListSelectionProps {
  const [selectedIds, setSelectedIds] = useState(initial.selectedIds ?? NO_SELECTION);
  const [focusedId, setFocusedId] = useState(initial.focusedId ?? null);

  return {
    selectedIds,
    onSelectedIdsChange: setSelectedIds,
    focusedId,
    onFocusedIdChange: setFocusedId,
  };
}
