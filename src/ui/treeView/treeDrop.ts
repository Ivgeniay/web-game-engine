import { findAncestors } from './treeFilter';
import type { TreeModel, TreeRow } from './treeModel';

export const TREE_DROP_POSITIONS = ['before', 'after', 'inside'] as const;

export type TreeDropPosition = (typeof TREE_DROP_POSITIONS)[number];

export type TreeDropTarget =
  | { readonly kind: 'node'; readonly id: string; readonly position: TreeDropPosition }
  | { readonly kind: 'root' };

export interface TreeDropPlacement {
  readonly target: TreeDropTarget;
  readonly rowIndex: number;
  readonly depth: number;
}

export type AutoScrollDirection = -1 | 0 | 1;

const EDGE_FRACTION = 0.25;
const ROOT_TARGET: TreeDropTarget = { kind: 'root' };

function positionInRow(fraction: number): TreeDropPosition {
  if (fraction < EDGE_FRACTION) {
    return 'before';
  }

  return fraction > 1 - EDGE_FRACTION ? 'after' : 'inside';
}

export function placeDrop(
  rows: readonly TreeRow[],
  offsetY: number,
  rowHeight: number,
): TreeDropPlacement {
  const y = Math.max(0, offsetY);
  const rowIndex = rowHeight > 0 ? Math.floor(y / rowHeight) : rows.length;
  const row = rows[rowIndex];

  if (row === undefined) {
    return { target: ROOT_TARGET, rowIndex: rows.length, depth: 0 };
  }

  const position = positionInRow((y - rowIndex * rowHeight) / rowHeight);
  const firstChild = rows[rowIndex + 1];

  if (position === 'after' && row.expanded && firstChild?.parentIndex === rowIndex) {
    return {
      target: { kind: 'node', id: firstChild.id, position: 'before' },
      rowIndex: rowIndex + 1,
      depth: firstChild.depth,
    };
  }

  return { target: { kind: 'node', id: row.id, position }, rowIndex, depth: row.depth };
}

export function isDropIntoItself(
  model: TreeModel,
  draggedIds: readonly string[],
  target: TreeDropTarget,
): boolean {
  if (target.kind === 'root') {
    return false;
  }

  const dragged = new Set(draggedIds);

  if (target.position === 'inside' && dragged.has(target.id)) {
    return true;
  }

  return (findAncestors(model, target.id) ?? []).some((id) => dragged.has(id));
}

export function collectDraggedIds(
  model: TreeModel,
  selectedIds: readonly string[],
): readonly string[] {
  const selected = new Set(selectedIds);
  const dragged: string[] = [];

  function visit(ids: readonly string[]): void {
    for (const id of ids) {
      if (selected.has(id)) {
        dragged.push(id);
      } else if (model.hasChildren(id)) {
        visit(model.getChildren(id));
      }
    }
  }

  visit(model.rootIds);

  return dragged;
}

export function defaultDragLabel(model: TreeModel, ids: readonly string[]): string {
  const [firstId] = ids;
  const first = firstId === undefined ? '' : model.getLabel(firstId);

  return ids.length > 1 ? `${first} (+${String(ids.length - 1)})` : first;
}

export function autoScrollDirection(
  clientY: number,
  top: number,
  bottom: number,
  edgeSize: number,
): AutoScrollDirection {
  if (clientY < top + edgeSize) {
    return -1;
  }

  return clientY > bottom - edgeSize ? 1 : 0;
}
