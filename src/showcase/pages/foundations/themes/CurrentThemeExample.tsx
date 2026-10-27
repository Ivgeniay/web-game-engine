import { useThemeStore } from '@/state/theme/useThemeStore';

const MODE_LABEL = 'Mode';
const RESOLVED_THEME_LABEL = 'Resolved theme';

export function CurrentThemeExample() {
  const mode = useThemeStore((state) => state.mode);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  return (
    <div>
      <p>
        {MODE_LABEL}: {mode}
      </p>
      <p>
        {RESOLVED_THEME_LABEL}: {resolvedTheme}
      </p>
    </div>
  );
}
