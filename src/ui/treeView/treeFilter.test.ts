import { describe, expect, it } from 'vitest';
import { filterTree, findAncestors, findMatch, normalizeFilter } from './treeFilter';
import { flattenTree } from './treeModel';
import { TEST_TREE } from './treeTestModel';

const LOCALE = 'en';
const TURKISH_LOCALE = 'tr';

describe('findMatch', () => {
  it('finds the query anywhere in the label, ignoring the case', () => {
    expect(findMatch('Main Camera', 'CAM', LOCALE)).toEqual({ start: 5, length: 3 });
  });

  it('returns no match when the query is missing', () => {
    expect(findMatch('Main Camera', 'light', LOCALE)).toBeNull();
  });

  it('uses the case rules of the language', () => {
    expect(findMatch('IŞIK', 'ışık', TURKISH_LOCALE)).toEqual({ start: 0, length: 4 });
    expect(findMatch('IŞIK', 'ışık', LOCALE)).toBeNull();
  });

  it('matches without a highlight when lowercasing changes the length', () => {
    expect(findMatch('İzmir', 'i̇z', LOCALE)).toEqual({ start: 0, length: 0 });
  });
});

describe('normalizeFilter', () => {
  it('ignores the spaces around the query', () => {
    expect(normalizeFilter('  rock ')).toBe('rock');
    expect(normalizeFilter('   ')).toBe('');
  });
});

describe('filterTree', () => {
  it('keeps the matches with their ancestors and searches collapsed nodes', () => {
    const filter = filterTree(TEST_TREE, 'rock', LOCALE);

    expect([...filter.matchIds]).toEqual(['rock']);
    expect([...filter.visibleIds].sort()).toEqual(['props', 'rock', 'world']);
    expect([...filter.parentIds].sort()).toEqual(['props', 'world']);
  });

  it('does not show the children of a match that do not match', () => {
    const filter = filterTree(TEST_TREE, 'props', LOCALE);
    const rows = flattenTree(TEST_TREE, filter.parentIds, filter);

    expect(rows.map(({ id }) => id)).toEqual(['world', 'props']);
    expect(rows[1]?.hasChildren).toBe(false);
  });

  it('shows the expanded ancestors in the tree order', () => {
    const filter = filterTree(TEST_TREE, 'r', LOCALE);
    const rows = flattenTree(TEST_TREE, filter.parentIds, filter);

    expect(rows.map(({ id }) => id)).toEqual([
      'world',
      'terrain',
      'props',
      'rock',
      'tree',
      'player',
      'camera',
    ]);
    expect(rows.find(({ id }) => id === 'world')?.setSize).toBe(2);
  });
});

describe('findAncestors', () => {
  it('returns the path from the root to the parent', () => {
    expect(findAncestors(TEST_TREE, 'rock')).toEqual(['world', 'props']);
  });

  it('returns an empty path for a root and nothing for an unknown id', () => {
    expect(findAncestors(TEST_TREE, 'light')).toEqual([]);
    expect(findAncestors(TEST_TREE, 'missing')).toBeNull();
  });
});
