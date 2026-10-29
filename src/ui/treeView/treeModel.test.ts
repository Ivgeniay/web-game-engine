import { describe, expect, it } from 'vitest';
import {
  NO_PARENT,
  collectExpandableSubtree,
  flattenTree,
  subtreeEnd,
  updateExpandedIds,
} from './treeModel';
import { TEST_TREE } from './treeTestModel';

function visibleIds(expanded: readonly string[]): readonly string[] {
  return flattenTree(TEST_TREE, new Set(expanded)).map(({ id }) => id);
}

describe('flattenTree', () => {
  it('shows only the roots when nothing is expanded', () => {
    expect(visibleIds([])).toEqual(['world', 'player', 'light']);
  });

  it('shows the children of expanded nodes in depth-first order', () => {
    expect(visibleIds(['world', 'props'])).toEqual([
      'world',
      'terrain',
      'props',
      'rock',
      'tree',
      'player',
      'light',
    ]);
  });

  it('hides the children of an expanded node inside a collapsed one', () => {
    expect(visibleIds(['props'])).toEqual(['world', 'player', 'light']);
  });

  it('describes the depth, the parent and the position of each row', () => {
    const rows = flattenTree(TEST_TREE, new Set(['world', 'props']));
    const rock = rows.find(({ id }) => id === 'rock');
    const world = rows[0];

    expect(rock).toEqual({
      id: 'rock',
      depth: 2,
      parentIndex: rows.findIndex(({ id }) => id === 'props'),
      hasChildren: false,
      expanded: false,
      posInSet: 1,
      setSize: 2,
    });
    expect(world).toMatchObject({
      parentIndex: NO_PARENT,
      expanded: true,
      posInSet: 1,
      setSize: 3,
    });
  });

  it('does not mark a leaf as expanded', () => {
    const rows = flattenTree(TEST_TREE, new Set(['light']));

    expect(rows.find(({ id }) => id === 'light')?.expanded).toBe(false);
  });
});

describe('collectExpandableSubtree', () => {
  it('collects the node and every descendant that has children', () => {
    expect([...collectExpandableSubtree(TEST_TREE, 'world')].sort()).toEqual(['props', 'world']);
  });

  it('is empty for a leaf', () => {
    expect(collectExpandableSubtree(TEST_TREE, 'light')).toEqual([]);
  });
});

describe('subtreeEnd', () => {
  it('finds the row after the last visible descendant', () => {
    const rows = flattenTree(TEST_TREE, new Set(['world', 'props']));
    const props = rows.findIndex(({ id }) => id === 'props');

    expect(rows[subtreeEnd(rows, props)]?.id).toBe('player');
    expect(rows[subtreeEnd(rows, 0)]?.id).toBe('player');
  });

  it('ends right after a collapsed node', () => {
    const rows = flattenTree(TEST_TREE, new Set());

    expect(subtreeEnd(rows, 0)).toBe(1);
  });
});

describe('updateExpandedIds', () => {
  it('adds new ids once and keeps the order', () => {
    expect(updateExpandedIds(['world'], ['props', 'world'], true)).toEqual(['world', 'props']);
  });

  it('removes the ids', () => {
    expect(updateExpandedIds(['world', 'props', 'player'], ['props', 'world'], false)).toEqual([
      'player',
    ]);
  });
});
