import { describe, expect, it } from 'vitest';
import {
  NO_ROW,
  firstEnabledRow,
  groupLabels,
  nextEnabledRow,
  rowsInGroup,
  searchRows,
} from './searchableMenuModel';
import type { SearchableMenuItem } from './searchableMenuModel';

const ITEMS: readonly SearchableMenuItem[] = [
  {
    id: 'physics',
    label: 'Physics',
    children: [
      { id: 'rigidbody', label: 'Rigidbody', disabled: true },
      { id: 'collider', label: 'Box Collider' },
    ],
  },
  {
    id: 'rendering',
    label: 'Rendering',
    children: [
      { id: 'light', label: 'Light' },
      { id: 'effects', label: 'Effects', children: [{ id: 'trail', label: 'Trail Renderer' }] },
    ],
  },
  { id: 'note', label: 'Note' },
];

describe('searchable menu model', () => {
  it('gives the rows of a group by the path of ids', () => {
    expect(rowsInGroup(ITEMS, []).map(({ item, group }) => [item.id, group])).toEqual([
      ['physics', true],
      ['rendering', true],
      ['note', false],
    ]);
    expect(rowsInGroup(ITEMS, ['rendering', 'effects']).map(({ item }) => item.id)).toEqual([
      'trail',
    ]);
    expect(groupLabels(ITEMS, ['rendering', 'effects'])).toEqual(['Rendering', 'Effects']);
  });

  it('searches the items of every level and keeps their path', () => {
    expect(searchRows(ITEMS, 'RE', 'en').map(({ item, path }) => [item.label, path])).toEqual([
      ['Trail Renderer', ['Rendering', 'Effects']],
    ]);
    expect(searchRows(ITEMS, 'li', 'en').map(({ item }) => item.id)).toEqual(['collider', 'light']);
  });

  it('skips disabled rows when moving', () => {
    const rows = rowsInGroup(ITEMS, ['physics']);

    expect(firstEnabledRow(rows)).toBe(1);
    expect(nextEnabledRow(rows, 1, -1)).toBe(1);
    expect(nextEnabledRow(rows, NO_ROW, 1)).toBe(1);
  });
});
