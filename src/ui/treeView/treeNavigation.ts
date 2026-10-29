import { NO_PARENT } from './treeModel';
import type { TreeRow } from './treeModel';

export type TreeKeyAction =
  | { readonly kind: 'expand'; readonly subtree: boolean }
  | { readonly kind: 'collapse'; readonly subtree: boolean }
  | { readonly kind: 'move'; readonly index: number }
  | { readonly kind: 'none' };

export interface TreeKey {
  readonly key: string;
  readonly altKey: boolean;
}

const NONE: TreeKeyAction = { kind: 'none' };

function rightAction(rows: readonly TreeRow[], index: number, row: TreeRow): TreeKeyAction {
  if (!row.hasChildren) {
    return NONE;
  }
  if (!row.expanded) {
    return { kind: 'expand', subtree: false };
  }

  const firstChild = index + 1;

  return rows[firstChild]?.parentIndex === index ? { kind: 'move', index: firstChild } : NONE;
}

function leftAction(row: TreeRow): TreeKeyAction {
  if (row.expanded) {
    return { kind: 'collapse', subtree: false };
  }

  return row.parentIndex === NO_PARENT ? NONE : { kind: 'move', index: row.parentIndex };
}

export function treeKeyAction(
  rows: readonly TreeRow[],
  index: number,
  { key, altKey }: TreeKey,
): TreeKeyAction | null {
  if (key !== 'ArrowRight' && key !== 'ArrowLeft') {
    return null;
  }

  const row = rows[index];

  if (row === undefined) {
    return NONE;
  }
  if (altKey) {
    if (!row.hasChildren) {
      return NONE;
    }

    return key === 'ArrowRight'
      ? { kind: 'expand', subtree: true }
      : { kind: 'collapse', subtree: true };
  }

  return key === 'ArrowRight' ? rightAction(rows, index, row) : leftAction(row);
}
