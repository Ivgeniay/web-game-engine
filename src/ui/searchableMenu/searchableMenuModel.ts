import type { IconSource } from '@/icons/icon';

export interface SearchableMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly disabled?: boolean | undefined;
  readonly children?: readonly SearchableMenuItem[] | undefined;
}

export interface SearchableMenuRow {
  readonly item: SearchableMenuItem;
  readonly path: readonly string[];
  readonly group: boolean;
}

export const NO_ROW = -1;

function isGroup(item: SearchableMenuItem): boolean {
  return item.children !== undefined;
}

function toRow(item: SearchableMenuItem, path: readonly string[]): SearchableMenuRow {
  return { item, path, group: isGroup(item) };
}

export function groupItems(
  items: readonly SearchableMenuItem[],
  groupPath: readonly string[],
): readonly SearchableMenuItem[] {
  return groupPath.reduce<readonly SearchableMenuItem[]>(
    (level, id) => level.find((item) => item.id === id)?.children ?? [],
    items,
  );
}

export function groupLabels(
  items: readonly SearchableMenuItem[],
  groupPath: readonly string[],
): readonly string[] {
  const labels: string[] = [];
  let level = items;

  for (const id of groupPath) {
    const group = level.find((item) => item.id === id);

    if (group === undefined) {
      break;
    }

    labels.push(group.label);
    level = group.children ?? [];
  }

  return labels;
}

export function rowsInGroup(
  items: readonly SearchableMenuItem[],
  groupPath: readonly string[],
): readonly SearchableMenuRow[] {
  return groupItems(items, groupPath).map((item) => toRow(item, []));
}

function collectLeaves(
  items: readonly SearchableMenuItem[],
  path: readonly string[],
): readonly SearchableMenuRow[] {
  return items.flatMap((item) =>
    item.children === undefined
      ? [toRow(item, path)]
      : collectLeaves(item.children, [...path, item.label]),
  );
}

export function searchRows(
  items: readonly SearchableMenuItem[],
  query: string,
  locale: string,
): readonly SearchableMenuRow[] {
  const needle = query.trim().toLocaleLowerCase(locale);

  return collectLeaves(items, []).filter((row) =>
    row.item.label.toLocaleLowerCase(locale).includes(needle),
  );
}

export function nextEnabledRow(
  rows: readonly SearchableMenuRow[],
  from: number,
  step: 1 | -1,
): number {
  for (let index = from + step; index >= 0 && index < rows.length; index += step) {
    if (rows[index]?.item.disabled !== true) {
      return index;
    }
  }

  return from;
}

export function firstEnabledRow(rows: readonly SearchableMenuRow[]): number {
  return nextEnabledRow(rows, NO_ROW, 1);
}
