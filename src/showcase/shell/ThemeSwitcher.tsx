import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import { THEME_MODES } from '@/state/theme/themeMode';
import type { ThemeMode } from '@/state/theme/themeMode';
import { useThemeStore } from '@/state/theme/useThemeStore';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import { showcaseMessages } from './showcaseMessages';
import styles from './switcher.module.css';

const THEME_MODE_KEYS = {
  dark: 'themeDark',
  light: 'themeLight',
  system: 'themeSystem',
} as const satisfies Record<ThemeMode, string>;

export function ThemeSwitcher() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const t = useMessages(showcaseMessages);
  const caption = t('themeCaption');
  const options = useMemo<readonly ToggleButtonGroupOption<ThemeMode>[]>(
    () =>
      THEME_MODES.map((themeMode) => ({ value: themeMode, label: t(THEME_MODE_KEYS[themeMode]) })),
    [t],
  );

  return (
    <div className={styles.root}>
      <span className={styles.caption} aria-hidden="true">
        {caption}
      </span>
      <ToggleButtonGroup
        label={caption}
        options={options}
        selection="single"
        value={mode}
        onValueChange={setMode}
        size="sm"
      />
    </div>
  );
}
