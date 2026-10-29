import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { useLocale } from '@/ui/locale/useLocale';
import { filterTree, findAncestors, normalizeFilter } from './treeFilter';
import type { TreeFilter } from './treeFilter';
import { updateExpandedIds } from './treeModel';
import type { TreeModel } from './treeModel';

export interface TreeFilterOptions {
  readonly model: TreeModel;
  readonly filter: string;
  readonly expandedIds: readonly string[];
  readonly onExpandedIdsChange: (expandedIds: readonly string[]) => void;
  readonly selectedIds: readonly string[];
  readonly focusedId: string | null;
  readonly onFocusedIdChange: (focusedId: string | null) => void;
}

export interface TreeFilterState {
  readonly query: string;
  readonly filter: TreeFilter | null;
  readonly expandedSet: ReadonlySet<string>;
  readonly setExpanded: (ids: readonly string[], expanded: boolean) => void;
  readonly takePendingReveal: () => string | null;
}

interface FilterCollapse {
  readonly query: string;
  readonly collapsedIds: readonly string[];
}

const NOTHING: readonly string[] = [];
const NO_COLLAPSE: FilterCollapse = { query: '', collapsedIds: NOTHING };

export function useTreeFilter({
  model,
  filter: rawFilter,
  expandedIds,
  onExpandedIdsChange,
  selectedIds,
  focusedId,
  onFocusedIdChange,
}: TreeFilterOptions): TreeFilterState {
  const locale = useLocale();
  const query = normalizeFilter(rawFilter);
  const filter = useMemo(
    () => (query === '' ? null : filterTree(model, query, locale)),
    [model, query, locale],
  );
  const [collapse, setCollapse] = useState(NO_COLLAPSE);
  const collapsedIds = collapse.query === query ? collapse.collapsedIds : NOTHING;
  const pendingReveal = useRef<string | null>(null);

  const ownerExpandedSet = useMemo(() => new Set(expandedIds), [expandedIds]);
  const filterExpandedSet = useMemo(() => {
    if (filter === null) {
      return null;
    }

    const collapsed = new Set(collapsedIds);

    return new Set([...filter.parentIds].filter((id) => !collapsed.has(id)));
  }, [filter, collapsedIds]);

  function setExpanded(ids: readonly string[], expanded: boolean): void {
    if (filter !== null) {
      const next = updateExpandedIds(collapsedIds, ids, !expanded);

      if (next.length !== collapsedIds.length) {
        setCollapse({ query, collapsedIds: next });
      }

      return;
    }

    const next = updateExpandedIds(expandedIds, ids, expanded);

    if (next.length !== expandedIds.length) {
      onExpandedIdsChange(next);
    }
  }

  const revealSelection = useEffectEvent(() => {
    const target =
      focusedId !== null && selectedIds.includes(focusedId) ? focusedId : selectedIds[0];
    const ancestors = target === undefined ? null : findAncestors(model, target);

    if (target === undefined || ancestors === null) {
      return;
    }

    const next = updateExpandedIds(expandedIds, ancestors, true);

    if (next.length !== expandedIds.length) {
      onExpandedIdsChange(next);
    }
    if (target !== focusedId) {
      onFocusedIdChange(target);
    }

    pendingReveal.current = target;
  });

  const filtering = filter !== null;
  const wasFiltering = useRef(filtering);

  useEffect(() => {
    if (wasFiltering.current && !filtering) {
      revealSelection();
    }

    wasFiltering.current = filtering;
  }, [filtering]);

  return {
    query,
    filter,
    expandedSet: filterExpandedSet ?? ownerExpandedSet,
    setExpanded,
    takePendingReveal: () => {
      const id = pendingReveal.current;
      pendingReveal.current = null;

      return id;
    },
  };
}
