export const LIST_NAVIGATION_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
] as const;

export type ListNavigationKey = (typeof LIST_NAVIGATION_KEYS)[number];

export const TYPEAHEAD_RESET_DELAY_MS = 500;

export interface TypeaheadInput {
  readonly query: string;
  readonly lastKeyTime: number;
}

export const EMPTY_TYPEAHEAD: TypeaheadInput = { query: '', lastKeyTime: 0 };

const NOT_FOUND = -1;
const SPACE_KEY = ' ';

export function isListNavigationKey(key: string): key is ListNavigationKey {
  return LIST_NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);
}

export function navigationIndex(
  key: ListNavigationKey,
  currentIndex: number,
  rowCount: number,
  pageRowCount: number,
): number {
  const lastIndex = rowCount - 1;

  if (currentIndex === NOT_FOUND) {
    return key === 'End' ? lastIndex : 0;
  }

  switch (key) {
    case 'ArrowUp':
      return Math.max(0, currentIndex - 1);
    case 'ArrowDown':
      return Math.min(lastIndex, currentIndex + 1);
    case 'Home':
      return 0;
    case 'End':
      return lastIndex;
    case 'PageUp':
      return Math.max(0, currentIndex - pageRowCount);
    case 'PageDown':
      return Math.min(lastIndex, currentIndex + pageRowCount);
  }
}

function continuesQuery({ query, lastKeyTime }: TypeaheadInput, keyTime: number): boolean {
  return query !== '' && keyTime - lastKeyTime < TYPEAHEAD_RESET_DELAY_MS;
}

export function isTypeaheadKey(
  key: string,
  input: TypeaheadInput,
  keyTime: number,
  hasCommandModifier: boolean,
): boolean {
  if (hasCommandModifier || key.length !== 1) {
    return false;
  }

  return key !== SPACE_KEY || continuesQuery(input, keyTime);
}

export function continueTypeahead(
  input: TypeaheadInput,
  key: string,
  keyTime: number,
): TypeaheadInput {
  const query = continuesQuery(input, keyTime) ? input.query + key : key;

  return { query, lastKeyTime: keyTime };
}

function isRepeatOfOneCharacter(query: string): boolean {
  return query === query.charAt(0).repeat(query.length);
}

export function findTypeaheadMatch(
  itemIds: readonly string[],
  getLabel: (id: string) => string,
  currentIndex: number,
  query: string,
  locale: string,
): number {
  const repeated = isRepeatOfOneCharacter(query);
  const search = (repeated ? query.slice(0, 1) : query).toLocaleLowerCase(locale);
  const startIndex = repeated ? currentIndex + 1 : Math.max(0, currentIndex);

  for (let offset = 0; offset < itemIds.length; offset += 1) {
    const index = (startIndex + offset) % itemIds.length;
    const id = itemIds[index];

    if (id !== undefined && getLabel(id).toLocaleLowerCase(locale).startsWith(search)) {
      return index;
    }
  }

  return NOT_FOUND;
}

export const GRID_NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'] as const;

export type GridNavigationKey = (typeof GRID_NAVIGATION_KEYS)[number];

export function isGridNavigationKey(key: string): key is GridNavigationKey {
  return GRID_NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);
}

export function gridNavigationIndex(
  key: GridNavigationKey,
  currentIndex: number,
  itemCount: number,
  columns: number,
): number {
  const lastIndex = itemCount - 1;

  if (currentIndex === NOT_FOUND) {
    return 0;
  }

  switch (key) {
    case 'ArrowLeft':
      return Math.max(0, currentIndex - 1);
    case 'ArrowRight':
      return Math.min(lastIndex, currentIndex + 1);
    case 'ArrowUp':
      return currentIndex - columns >= 0 ? currentIndex - columns : currentIndex;
    case 'ArrowDown': {
      const below = currentIndex + columns;
      const lastRow = Math.floor(lastIndex / columns);

      if (below <= lastIndex) {
        return below;
      }

      return Math.floor(currentIndex / columns) < lastRow ? lastIndex : currentIndex;
    }
  }
}
