import type { IconSource } from '@/icons/icon';

export interface SelectOption<T extends string> {
  readonly kind: 'option';
  readonly value: T;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly disabled?: boolean | undefined;
}

export interface SelectSeparator {
  readonly kind: 'separator';
  readonly id: string;
}

export type SelectEntry<T extends string> = SelectOption<T> | SelectSeparator;

export interface SelectAction {
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly onSelect: () => void;
}

export function selectOptionsOf<T extends string>(
  entries: readonly SelectEntry<T>[],
): readonly SelectOption<T>[] {
  return entries.filter((entry): entry is SelectOption<T> => entry.kind === 'option');
}

export function findSelectedOption<T extends string>(
  entries: readonly SelectEntry<T>[],
  value: T | null,
): SelectOption<T> | undefined {
  return selectOptionsOf(entries).find((option) => option.value === value);
}

export function selectedListIndex<T extends string>(
  entries: readonly SelectEntry<T>[],
  value: T | null,
): number | null {
  const index = selectOptionsOf(entries).findIndex((option) => option.value === value);

  return index === -1 ? null : index;
}
