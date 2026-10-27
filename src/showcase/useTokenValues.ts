import { useRerenderOnThemeChange } from '@/state/theme/useRerenderOnThemeChange';

export type TokenValues = ReadonlyMap<string, string>;

function readTokenValues(names: readonly string[]): TokenValues {
  const styles = getComputedStyle(document.documentElement);

  return new Map(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
}

export function useTokenValues(names: readonly string[]): TokenValues {
  useRerenderOnThemeChange();

  return readTokenValues(names);
}
