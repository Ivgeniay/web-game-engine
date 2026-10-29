import type { MenuCheckedState } from '@/contracts/menu';

export interface FlagOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean | undefined;
}

export interface FlagsChange<T extends string> {
  readonly on: readonly T[];
  readonly mixed: readonly T[];
}

export interface FlagsState<T extends string> {
  readonly options: readonly FlagOption<T>[];
  readonly value: readonly T[];
  readonly mixedFlags: readonly T[];
}

export interface FlagsSummaryLabels {
  readonly none: string;
  readonly all: string;
  readonly mixed: string;
}

export const FLAG_NAMES_SEPARATOR = ', ';

function onFlags<T extends string>({ options, value }: FlagsState<T>): readonly T[] {
  return options.filter((option) => value.includes(option.value)).map((option) => option.value);
}

function mixedFlagsOf<T extends string>({ options, mixedFlags }: FlagsState<T>): readonly T[] {
  return options
    .filter((option) => mixedFlags.includes(option.value))
    .map((option) => option.value);
}

export function flagCheckedState<T extends string>(
  state: FlagsState<T>,
  flag: T,
): MenuCheckedState {
  if (state.mixedFlags.includes(flag)) {
    return 'mixed';
  }

  return state.value.includes(flag);
}

export function hasNoFlags<T extends string>(state: FlagsState<T>): boolean {
  return onFlags(state).length === 0 && mixedFlagsOf(state).length === 0;
}

export function hasAllFlags<T extends string>(state: FlagsState<T>): boolean {
  return state.options.length > 0 && onFlags(state).length === state.options.length;
}

export function flagsSummary<T extends string>(
  state: FlagsState<T>,
  labels: FlagsSummaryLabels,
): string {
  if (mixedFlagsOf(state).length > 0) {
    return labels.mixed;
  }

  if (hasNoFlags(state)) {
    return labels.none;
  }

  if (hasAllFlags(state)) {
    return labels.all;
  }

  return state.options
    .filter((option) => state.value.includes(option.value))
    .map((option) => option.label)
    .join(FLAG_NAMES_SEPARATOR);
}

function changeWith<T extends string>(
  state: FlagsState<T>,
  resolve: (option: FlagOption<T>) => MenuCheckedState,
): FlagsChange<T> {
  const resolved = state.options.map((option) => ({
    flag: option.value,
    checked: resolve(option),
  }));

  return {
    on: resolved.filter(({ checked }) => checked === true).map(({ flag }) => flag),
    mixed: resolved.filter(({ checked }) => checked === 'mixed').map(({ flag }) => flag),
  };
}

export function toggleFlag<T extends string>(
  state: FlagsState<T>,
  flag: T,
  enabled: boolean,
): FlagsChange<T> {
  return changeWith(state, (option) =>
    option.value === flag ? enabled : flagCheckedState(state, option.value),
  );
}

export function setAllFlags<T extends string>(
  state: FlagsState<T>,
  enabled: boolean,
): FlagsChange<T> {
  return changeWith(state, (option) =>
    option.disabled === true ? flagCheckedState(state, option.value) : enabled,
  );
}

export function applyFlagsChange<T extends string>(
  current: readonly T[],
  change: FlagsChange<T>,
  options: readonly FlagOption<T>[],
): readonly T[] {
  return options
    .map((option) => option.value)
    .filter(
      (flag) => change.on.includes(flag) || (change.mixed.includes(flag) && current.includes(flag)),
    );
}
