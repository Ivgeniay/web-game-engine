import { describe, expect, it } from 'vitest';
import { PLAIN_GESTURE, applySelectionGesture, haveSameIds, orderSelection } from './listSelection';
import type { ListSelection, SelectionGesture } from './listSelection';

const ITEMS = ['a', 'b', 'c', 'd', 'e'];
const HIDDEN_ID = 'hidden';

const TOGGLE: SelectionGesture = { toggle: true, extend: false };
const EXTEND: SelectionGesture = { toggle: false, extend: true };
const TOGGLE_EXTEND: SelectionGesture = { toggle: true, extend: true };

const B_SELECTED: ListSelection = { selectedIds: ['b'], anchorId: 'b' };

describe('applySelectionGesture', () => {
  it('selects only the target on a plain click', () => {
    const selection = { selectedIds: ['a', 'c'], anchorId: 'a' };

    expect(applySelectionGesture(ITEMS, selection, 'd', PLAIN_GESTURE, 'multiple')).toEqual({
      selectedIds: ['d'],
      anchorId: 'd',
    });
  });

  it('adds and removes the target with the toggle', () => {
    const added = applySelectionGesture(ITEMS, B_SELECTED, 'd', TOGGLE, 'multiple');
    const removed = applySelectionGesture(ITEMS, added, 'b', TOGGLE, 'multiple');

    expect(added).toEqual({ selectedIds: ['b', 'd'], anchorId: 'd' });
    expect(removed).toEqual({ selectedIds: ['d'], anchorId: 'b' });
  });

  it('selects the range from the anchor in both directions and keeps the anchor', () => {
    const down = applySelectionGesture(ITEMS, B_SELECTED, 'd', EXTEND, 'multiple');
    const up = applySelectionGesture(ITEMS, down, 'a', EXTEND, 'multiple');

    expect(down).toEqual({ selectedIds: ['b', 'c', 'd'], anchorId: 'b' });
    expect(up).toEqual({ selectedIds: ['a', 'b'], anchorId: 'b' });
  });

  it('adds the range to the selection with both modifiers', () => {
    const selection = { selectedIds: ['e', 'b'], anchorId: 'b' };

    expect(applySelectionGesture(ITEMS, selection, 'c', TOGGLE_EXTEND, 'multiple')).toEqual({
      selectedIds: ['b', 'c', 'e'],
      anchorId: 'b',
    });
  });

  it('starts the range at the target when the anchor is gone', () => {
    const selection = { selectedIds: [], anchorId: 'removed' };

    expect(applySelectionGesture(ITEMS, selection, 'c', EXTEND, 'multiple')).toEqual({
      selectedIds: ['c'],
      anchorId: 'c',
    });
  });

  it('ignores the modifiers in the single mode', () => {
    expect(applySelectionGesture(ITEMS, B_SELECTED, 'd', TOGGLE_EXTEND, 'single')).toEqual({
      selectedIds: ['d'],
      anchorId: 'd',
    });
  });
});

describe('orderSelection', () => {
  it('orders the ids as in the list and keeps the ids that are not shown at the end', () => {
    expect(orderSelection(ITEMS, ['d', HIDDEN_ID, 'a'])).toEqual(['a', 'd', HIDDEN_ID]);
  });

  it('drops duplicates', () => {
    expect(orderSelection(ITEMS, ['c', 'c'])).toEqual(['c']);
  });
});

describe('haveSameIds', () => {
  it('compares the ids in order', () => {
    expect(haveSameIds(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(haveSameIds(['a', 'b'], ['b', 'a'])).toBe(false);
    expect(haveSameIds(['a'], ['a', 'b'])).toBe(false);
  });
});
