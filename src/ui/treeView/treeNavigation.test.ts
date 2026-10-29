import { describe, expect, it } from 'vitest';
import { flattenTree } from './treeModel';
import type { TreeRow } from './treeModel';
import { treeKeyAction } from './treeNavigation';
import { TEST_TREE, TEST_TREE_WITH_EMPTY_NODE } from './treeTestModel';

const ROWS = flattenTree(TEST_TREE, new Set(['world']));
const RIGHT = { key: 'ArrowRight', altKey: false };
const LEFT = { key: 'ArrowLeft', altKey: false };
const ALT_RIGHT = { key: 'ArrowRight', altKey: true };
const ALT_LEFT = { key: 'ArrowLeft', altKey: true };
const NO_ROW = -1;

function indexOf(rows: readonly TreeRow[], id: string): number {
  return rows.findIndex((row) => row.id === id);
}

describe('treeKeyAction', () => {
  it('expands a collapsed node with Right and moves to its first child after that', () => {
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'props'), RIGHT)).toEqual({
      kind: 'expand',
      subtree: false,
    });
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'world'), RIGHT)).toEqual({
      kind: 'move',
      index: indexOf(ROWS, 'terrain'),
    });
  });

  it('collapses an expanded node with Left and moves to the parent otherwise', () => {
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'world'), LEFT)).toEqual({
      kind: 'collapse',
      subtree: false,
    });
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'props'), LEFT)).toEqual({
      kind: 'move',
      index: indexOf(ROWS, 'world'),
    });
  });

  it('does nothing at a leaf with Right and at a collapsed root with Left', () => {
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'terrain'), RIGHT)).toEqual({ kind: 'none' });
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'player'), LEFT)).toEqual({ kind: 'none' });
  });

  it('does not move into an expanded node without children', () => {
    const rows = flattenTree(TEST_TREE_WITH_EMPTY_NODE, new Set(['empty']));

    expect(treeKeyAction(rows, 0, RIGHT)).toEqual({ kind: 'none' });
  });

  it('expands and collapses the subtree with Alt', () => {
    const world = indexOf(ROWS, 'world');

    expect(treeKeyAction(ROWS, world, ALT_RIGHT)).toEqual({ kind: 'expand', subtree: true });
    expect(treeKeyAction(ROWS, world, ALT_LEFT)).toEqual({ kind: 'collapse', subtree: true });
    expect(treeKeyAction(ROWS, indexOf(ROWS, 'light'), ALT_RIGHT)).toEqual({ kind: 'none' });
  });

  it('handles the horizontal arrows without a focused row', () => {
    expect(treeKeyAction(ROWS, NO_ROW, RIGHT)).toEqual({ kind: 'none' });
  });

  it('leaves other keys to the list', () => {
    expect(treeKeyAction(ROWS, 0, { key: 'ArrowDown', altKey: false })).toBeNull();
  });
});
