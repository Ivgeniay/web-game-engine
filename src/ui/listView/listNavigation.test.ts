import { describe, expect, it } from 'vitest';
import {
  gridNavigationIndex,
  isGridNavigationKey,
  EMPTY_TYPEAHEAD,
  TYPEAHEAD_RESET_DELAY_MS,
  continueTypeahead,
  findTypeaheadMatch,
  isListNavigationKey,
  isTypeaheadKey,
  navigationIndex,
} from './listNavigation';

const ROW_COUNT = 20;
const LAST_INDEX = ROW_COUNT - 1;
const PAGE_ROWS = 5;
const MIDDLE_INDEX = 10;
const NO_INDEX = -1;
const LOCALE = 'en';
const TURKISH_LOCALE = 'tr';
const KEY_TIME = 1000;

const LABELS: Readonly<Record<string, string>> = {
  camera: 'Main Camera',
  light: 'Directional Light',
  cube: 'Cube',
  capsule: 'Capsule',
  player: 'Player',
};

const ITEMS = Object.keys(LABELS);

function getLabel(id: string): string {
  return LABELS[id] ?? '';
}

describe('navigationIndex', () => {
  it('moves by one row and stops at the ends', () => {
    expect(navigationIndex('ArrowDown', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(MIDDLE_INDEX + 1);
    expect(navigationIndex('ArrowUp', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(MIDDLE_INDEX - 1);
    expect(navigationIndex('ArrowUp', 0, ROW_COUNT, PAGE_ROWS)).toBe(0);
    expect(navigationIndex('ArrowDown', LAST_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(LAST_INDEX);
  });

  it('moves by a page and stops at the ends', () => {
    expect(navigationIndex('PageDown', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(
      MIDDLE_INDEX + PAGE_ROWS,
    );
    expect(navigationIndex('PageUp', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(
      MIDDLE_INDEX - PAGE_ROWS,
    );
    expect(navigationIndex('PageUp', 1, ROW_COUNT, PAGE_ROWS)).toBe(0);
    expect(navigationIndex('PageDown', LAST_INDEX - 1, ROW_COUNT, PAGE_ROWS)).toBe(LAST_INDEX);
  });

  it('goes to the ends with Home and End', () => {
    expect(navigationIndex('Home', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(0);
    expect(navigationIndex('End', MIDDLE_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(LAST_INDEX);
  });

  it('starts at the first row without a focused row, End starts at the last', () => {
    expect(navigationIndex('ArrowUp', NO_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(0);
    expect(navigationIndex('ArrowDown', NO_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(0);
    expect(navigationIndex('End', NO_INDEX, ROW_COUNT, PAGE_ROWS)).toBe(LAST_INDEX);
  });
});

describe('isListNavigationKey', () => {
  it('accepts only the navigation keys', () => {
    expect(isListNavigationKey('PageDown')).toBe(true);
    expect(isListNavigationKey('ArrowLeft')).toBe(false);
  });
});

describe('typeahead input', () => {
  it('takes printable characters without command modifiers', () => {
    expect(isTypeaheadKey('c', EMPTY_TYPEAHEAD, KEY_TIME, false)).toBe(true);
    expect(isTypeaheadKey('c', EMPTY_TYPEAHEAD, KEY_TIME, true)).toBe(false);
    expect(isTypeaheadKey('Enter', EMPTY_TYPEAHEAD, KEY_TIME, false)).toBe(false);
  });

  it('takes a space only inside a query that has not expired', () => {
    const typing = { query: 'main', lastKeyTime: KEY_TIME };

    expect(isTypeaheadKey(' ', EMPTY_TYPEAHEAD, KEY_TIME, false)).toBe(false);
    expect(isTypeaheadKey(' ', typing, KEY_TIME + 1, false)).toBe(true);
    expect(isTypeaheadKey(' ', typing, KEY_TIME + TYPEAHEAD_RESET_DELAY_MS, false)).toBe(false);
  });

  it('continues the query within the delay and starts a new one after it', () => {
    const first = continueTypeahead(EMPTY_TYPEAHEAD, 'c', TYPEAHEAD_RESET_DELAY_MS);
    const second = continueTypeahead(first, 'a', first.lastKeyTime + 1);
    const late = continueTypeahead(second, 'p', second.lastKeyTime + TYPEAHEAD_RESET_DELAY_MS);

    expect(second.query).toBe('ca');
    expect(late.query).toBe('p');
  });
});

describe('findTypeaheadMatch', () => {
  it('finds the first label that starts with the query, ignoring the case', () => {
    expect(findTypeaheadMatch(ITEMS, getLabel, NO_INDEX, 'DIR', LOCALE)).toBe(
      ITEMS.indexOf('light'),
    );
  });

  it('keeps the current row while it still matches a longer query', () => {
    const cube = ITEMS.indexOf('cube');

    expect(findTypeaheadMatch(ITEMS, getLabel, cube, 'cu', LOCALE)).toBe(cube);
    expect(findTypeaheadMatch(ITEMS, getLabel, cube, 'ca', LOCALE)).toBe(ITEMS.indexOf('capsule'));
  });

  it('cycles through the rows when one character repeats', () => {
    const cube = ITEMS.indexOf('cube');
    const capsule = ITEMS.indexOf('capsule');

    expect(findTypeaheadMatch(ITEMS, getLabel, cube, 'cc', LOCALE)).toBe(capsule);
    expect(findTypeaheadMatch(ITEMS, getLabel, capsule, 'ccc', LOCALE)).toBe(cube);
  });

  it('uses the case rules of the language', () => {
    const items = ['island'];

    expect(findTypeaheadMatch(items, () => 'Işık', NO_INDEX, 'ı', TURKISH_LOCALE)).toBe(0);
    expect(findTypeaheadMatch(items, () => 'İzmir', NO_INDEX, 'i', TURKISH_LOCALE)).toBe(0);
  });

  it('returns no row without a match', () => {
    expect(findTypeaheadMatch(ITEMS, getLabel, 0, 'x', LOCALE)).toBe(NO_INDEX);
  });
});

describe('gridNavigationIndex', () => {
  const ITEMS = 12;
  const COLUMNS = 5;

  it('moves by one cell left and right and stays at the ends', () => {
    expect(gridNavigationIndex('ArrowRight', 3, ITEMS, COLUMNS)).toBe(4);
    expect(gridNavigationIndex('ArrowLeft', 3, ITEMS, COLUMNS)).toBe(2);
    expect(gridNavigationIndex('ArrowLeft', 0, ITEMS, COLUMNS)).toBe(0);
    expect(gridNavigationIndex('ArrowRight', 11, ITEMS, COLUMNS)).toBe(11);
  });

  it('moves by one row up and down', () => {
    expect(gridNavigationIndex('ArrowDown', 1, ITEMS, COLUMNS)).toBe(6);
    expect(gridNavigationIndex('ArrowUp', 6, ITEMS, COLUMNS)).toBe(1);
    expect(gridNavigationIndex('ArrowUp', 2, ITEMS, COLUMNS)).toBe(2);
  });

  it('goes to the last item when the row below is shorter', () => {
    expect(gridNavigationIndex('ArrowDown', 8, ITEMS, COLUMNS)).toBe(11);
    expect(gridNavigationIndex('ArrowDown', 11, ITEMS, COLUMNS)).toBe(11);
  });

  it('starts from the first item when nothing has the focus', () => {
    expect(gridNavigationIndex('ArrowDown', -1, ITEMS, COLUMNS)).toBe(0);
  });

  it('recognizes only the arrows', () => {
    expect(isGridNavigationKey('ArrowLeft')).toBe(true);
    expect(isGridNavigationKey('Home')).toBe(false);
  });
});
