import { THEME_MODES } from '@/state/theme/themeMode';
import type { ThemeMode } from '@/state/theme/themeMode';
import { useThemeStore } from '@/state/theme/useThemeStore';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './switcher.module.css';

const CAPTION = 'theme';

const THEME_OPTIONS: readonly ToggleButtonGroupOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  value: mode,
  label: mode,
}));

export function ThemeSwitcher() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <div className={styles.root}>
      <span className={styles.caption} aria-hidden="true">
        {CAPTION}
      </span>
      <ToggleButtonGroup
        label={CAPTION}
        options={THEME_OPTIONS}
        selection="single"
        value={mode}
        onValueChange={setMode}
        size="sm"
      />
    </div>
  );
}
