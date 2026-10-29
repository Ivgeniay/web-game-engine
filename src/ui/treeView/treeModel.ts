import type { IconSource } from '@/icons/icon';

export interface TreeModel {
  readonly rootIds: readonly string[];
  readonly getChildren: (id: string) => readonly string[];
  readonly hasChildren: (id: string) => boolean;
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string, expanded: boolean) => IconSource | undefined) | undefined;
}

export interface TreeRow {
  readonly id: string;
  readonly depth: number;
  readonly parentIndex: number;
  readonly hasChildren: boolean;
  readonly expanded: boolean;
  readonly posInSet: number;
  readonly setSize: number;
}

export interface TreeVisibility {
  readonly visibleIds: ReadonlySet<string>;
  readonly parentIds: ReadonlySet<string>;
}

export const NO_PARENT = -1;

export function flattenTree(
  model: TreeModel,
  expandedIds: ReadonlySet<string>,
  visibility: TreeVisibility | null = null,
): readonly TreeRow[] {
  const rows: TreeRow[] = [];

  function shownIds(ids: readonly string[]): readonly string[] {
    return visibility === null ? ids : ids.filter((id) => visibility.visibleIds.has(id));
  }

  function hasShownChildren(id: string): boolean {
    return visibility === null ? model.hasChildren(id) : visibility.parentIds.has(id);
  }

  function visit(allIds: readonly string[], depth: number, parentIndex: number): void {
    const ids = shownIds(allIds);

    ids.forEach((id, position) => {
      const hasChildren = hasShownChildren(id);
      const expanded = hasChildren && expandedIds.has(id);
      const index = rows.length;

      rows.push({
        id,
        depth,
        parentIndex,
        hasChildren,
        expanded,
        posInSet: position + 1,
        setSize: ids.length,
      });

      if (expanded) {
        visit(model.getChildren(id), depth + 1, index);
      }
    });
  }

  visit(model.rootIds, 0, NO_PARENT);

  return rows;
}

export function collectExpandableSubtree(model: TreeModel, rootId: string): readonly string[] {
  const expandable: string[] = [];
  const pending = [rootId];

  for (let id = pending.pop(); id !== undefined; id = pending.pop()) {
    if (model.hasChildren(id)) {
      expandable.push(id);
      pending.push(...model.getChildren(id));
    }
  }

  return expandable;
}

export function subtreeEnd(rows: readonly TreeRow[], index: number): number {
  const depth = rows[index]?.depth;

  if (depth === undefined) {
    return index;
  }

  let end = index + 1;

  while (end < rows.length && (rows[end]?.depth ?? depth) > depth) {
    end += 1;
  }

  return end;
}

export function updateExpandedIds(
  expandedIds: readonly string[],
  ids: readonly string[],
  expanded: boolean,
): readonly string[] {
  const changing = new Set(ids);

  if (!expanded) {
    return expandedIds.filter((id) => !changing.has(id));
  }

  const current = new Set(expandedIds);

  return [...expandedIds, ...ids.filter((id) => !current.has(id))];
}
