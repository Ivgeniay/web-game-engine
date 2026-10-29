import { useState } from 'react';
import { useListViewState } from '@/ui/listView/useListViewState';
import type { ListViewInitialState } from '@/ui/listView/useListViewState';
import type { ListSelectionProps } from '@/ui/listView/useListInteraction';
import type { TreeExpansionProps } from './TreeView';

export interface TreeViewInitialState extends ListViewInitialState {
  readonly expandedIds?: readonly string[];
}

export interface TreeViewStateProps extends ListSelectionProps, TreeExpansionProps {
  readonly renamingId: string | null;
  readonly onRenamingIdChange: (renamingId: string | null) => void;
}

const NOTHING_EXPANDED: readonly string[] = [];

export function useTreeViewState(initial: TreeViewInitialState = {}): TreeViewStateProps {
  const selection = useListViewState(initial);
  const [expandedIds, setExpandedIds] = useState(initial.expandedIds ?? NOTHING_EXPANDED);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  return {
    ...selection,
    expandedIds,
    onExpandedIdsChange: setExpandedIds,
    renamingId,
    onRenamingIdChange: setRenamingId,
  };
}
