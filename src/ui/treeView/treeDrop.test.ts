import { describe, expect, it } from 'vitest';
import { flattenTree } from './treeModel';
import {
  autoScrollDirection,
  collectDraggedIds,
  defaultDragLabel,
  isDropIntoItself,
  placeDrop,
} from './treeDrop';
import { TEST_TREE } from './treeTestModel';

const ROW_HEIGHT = 20;
const TOP_OF_ROW = 2;
const MIDDLE_OF_ROW = 10;
const BOTTOM_OF_ROW = 18;
const ROWS = flattenTree(TEST_TREE, new Set(['world']));
const EDGE = 20;
const VIEW_TOP = 100;
const VIEW_BOTTOM = 300;

function offsetIn(id: string, insideRow: number): number {
  return ROWS.findIndex((row) => row.id === id) * ROW_HEIGHT + insideRow;
}

describe('placeDrop', () => {
  it('places the drop before, inside or after a row by the pointer height in it', () => {
    expect(placeDrop(ROWS, offsetIn('player', TOP_OF_ROW), ROW_HEIGHT).target).toEqual({
      kind: 'node',
      id: 'player',
      position: 'before',
    });
    expect(placeDrop(ROWS, offsetIn('player', MIDDLE_OF_ROW), ROW_HEIGHT).target).toEqual({
      kind: 'node',
      id: 'player',
      position: 'inside',
    });
    expect(placeDrop(ROWS, offsetIn('player', BOTTOM_OF_ROW), ROW_HEIGHT)).toEqual({
      target: { kind: 'node', id: 'player', position: 'after' },
      rowIndex: ROWS.findIndex((row) => row.id === 'player'),
      depth: 0,
    });
  });

  it('turns the bottom of an expanded node into the place before its first child', () => {
    expect(placeDrop(ROWS, offsetIn('world', BOTTOM_OF_ROW), ROW_HEIGHT)).toEqual({
      target: { kind: 'node', id: 'terrain', position: 'before' },
      rowIndex: 1,
      depth: 1,
    });
  });

  it('drops to the end of the roots below the last row', () => {
    expect(placeDrop(ROWS, ROWS.length * ROW_HEIGHT + TOP_OF_ROW, ROW_HEIGHT)).toEqual({
      target: { kind: 'root' },
      rowIndex: ROWS.length,
      depth: 0,
    });
    expect(placeDrop([], 0, ROW_HEIGHT).target).toEqual({ kind: 'root' });
  });
});

describe('isDropIntoItself', () => {
  it('forbids a node inside itself and anywhere inside its descendants', () => {
    expect(
      isDropIntoItself(TEST_TREE, ['world'], { kind: 'node', id: 'world', position: 'inside' }),
    ).toBe(true);
    expect(
      isDropIntoItself(TEST_TREE, ['world'], { kind: 'node', id: 'rock', position: 'before' }),
    ).toBe(true);
    expect(
      isDropIntoItself(TEST_TREE, ['props'], { kind: 'node', id: 'tree', position: 'inside' }),
    ).toBe(true);
  });

  it('allows other places, the place next to itself and the root', () => {
    expect(
      isDropIntoItself(TEST_TREE, ['rock'], { kind: 'node', id: 'player', position: 'inside' }),
    ).toBe(false);
    expect(
      isDropIntoItself(TEST_TREE, ['world'], { kind: 'node', id: 'world', position: 'after' }),
    ).toBe(false);
    expect(isDropIntoItself(TEST_TREE, ['world'], { kind: 'root' })).toBe(false);
  });
});

describe('collectDraggedIds', () => {
  it('keeps the topmost selected nodes in the tree order', () => {
    expect(collectDraggedIds(TEST_TREE, ['camera', 'rock', 'world', 'light'])).toEqual([
      'world',
      'camera',
      'light',
    ]);
  });

  it('finds selected nodes inside collapsed ones', () => {
    expect(collectDraggedIds(TEST_TREE, ['tree', 'terrain'])).toEqual(['terrain', 'tree']);
  });
});

describe('defaultDragLabel', () => {
  it('names the first node and counts the others', () => {
    expect(defaultDragLabel(TEST_TREE, ['world'])).toBe('World');
    expect(defaultDragLabel(TEST_TREE, ['world', 'camera', 'light'])).toBe('World (+2)');
  });
});

describe('autoScrollDirection', () => {
  it('scrolls up near the top edge, down near the bottom edge and stays otherwise', () => {
    expect(autoScrollDirection(VIEW_TOP + 1, VIEW_TOP, VIEW_BOTTOM, EDGE)).toBe(-1);
    expect(autoScrollDirection(VIEW_BOTTOM - 1, VIEW_TOP, VIEW_BOTTOM, EDGE)).toBe(1);
    expect(autoScrollDirection(VIEW_TOP + EDGE * 2, VIEW_TOP, VIEW_BOTTOM, EDGE)).toBe(0);
  });
});
