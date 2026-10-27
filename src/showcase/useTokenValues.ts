import { useThemeStore } from '@/state/theme/useThemeStore';

export type TokenValues = ReadonlyMap<string, string>;

function readTokenValues(names: readonly string[]): TokenValues {
  const styles = getComputedStyle(document.documentElement);

  return new Map(names.map((name) => [name, styles.getPropertyValue(name).trim()]));
}

export function useTokenValues(names: readonly string[]): TokenValues {
  useThemeStore((state) => state.resolvedTheme);

  return readTokenValues(names);
}
