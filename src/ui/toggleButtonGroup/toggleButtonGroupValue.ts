export const TOGGLE_SELECTION_MODES = ['single', 'optional', 'multiple'] as const;

export type ToggleSelectionMode = (typeof TOGGLE_SELECTION_MODES)[number];

export type ToggleGroupSelection<T extends string> =
  | { readonly selection: 'single'; readonly value: T }
  | { readonly selection: 'optional'; readonly value: T | null }
  | { readonly selection: 'multiple'; readonly value: readonly T[] };

export function isOptionSelected<T extends string>(
  state: ToggleGroupSelection<T>,
  option: T,
): boolean {
  switch (state.selection) {
    case 'single':
    case 'optional':
      return state.value === option;
    case 'multiple':
      return state.value.includes(option);
  }
}

export function toggleMultipleValue<T extends string>(
  value: readonly T[],
  option: T,
  pressed: boolean,
  optionOrder: readonly T[],
): readonly T[] {
  return optionOrder.filter((candidate) =>
    candidate === option ? pressed : value.includes(candidate),
  );
}
