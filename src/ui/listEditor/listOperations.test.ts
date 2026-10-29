import { describe, expect, it } from 'vitest';
import {
  dropIndex,
  insertionIndexAt,
  moveItem,
  removeItem,
  replaceItem,
  resizeItems,
} from './listOperations';

const ITEMS = ['a', 'b', 'c', 'd'] as const;

function createItem(): string {
  return 'new';
}

describe('list operations', () => {
  it('replaces and removes an item by index', () => {
    expect(replaceItem(ITEMS, 1, 'x')).toEqual(['a', 'x', 'c', 'd']);
    expect(removeItem(ITEMS, 0)).toEqual(['b', 'c', 'd']);
  });

  it('moves an item to a new index and ignores moves out of the list', () => {
    expect(moveItem(ITEMS, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(ITEMS, 3, 0)).toEqual(['d', 'a', 'b', 'c']);
    expect(moveItem(ITEMS, 0, -1)).toBe(ITEMS);
    expect(moveItem(ITEMS, 3, 4)).toBe(ITEMS);
  });

  it('grows with copies of the last item and shrinks from the end', () => {
    expect(resizeItems(['a'], 3, createItem)).toEqual(['a', 'a', 'a']);
    expect(resizeItems([], 2, createItem)).toEqual(['new', 'new']);
    expect(resizeItems(ITEMS, 1, createItem)).toEqual(['a']);
    expect(resizeItems(ITEMS, -1, createItem)).toEqual([]);
  });

  it('turns a pointer position into an insertion index and a target index', () => {
    const middles = [10, 30, 50];

    expect(insertionIndexAt(middles, 5)).toBe(0);
    expect(insertionIndexAt(middles, 35)).toBe(2);
    expect(insertionIndexAt(middles, 80)).toBe(3);
    expect(dropIndex(3, 0)).toBe(2);
    expect(dropIndex(0, 2)).toBe(0);
  });
});
