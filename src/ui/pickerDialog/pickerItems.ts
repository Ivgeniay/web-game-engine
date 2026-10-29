export const NONE_ITEM_ID = '\u0000none';

export function itemIdOf(value: string | null): string {
  return value ?? NONE_ITEM_ID;
}

export function valueOfItem(id: string): string | null {
  return id === NONE_ITEM_ID ? null : id;
}

export function filterPickerItems(
  itemIds: readonly string[],
  query: string,
  getLabel: (id: string) => string,
  locale: string,
): readonly string[] {
  const needle = query.trim().toLocaleLowerCase(locale);

  if (needle === '') {
    return [NONE_ITEM_ID, ...itemIds];
  }

  return itemIds.filter((id) => getLabel(id).toLocaleLowerCase(locale).includes(needle));
}
