import { useThemeStore } from './useThemeStore';

export function useRerenderOnThemeChange(): void {
  useThemeStore((state) => state.resolvedTheme);
}
