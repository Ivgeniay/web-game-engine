import { THEME_MODES } from '@/state/theme/themeMode';
import type { ThemeMode } from '@/state/theme/themeMode';
import { useThemeStore } from '@/state/theme/useThemeStore';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';

const GROUP_LABEL = 'Theme mode';

const MODE_OPTIONS: readonly ToggleButtonGroupOption<ThemeMode>[] = THEME_MODES.map((mode) => ({
  value: mode,
  label: mode,
}));

export function ThemeModeExample() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <ToggleButtonGroup
      label={GROUP_LABEL}
      options={MODE_OPTIONS}
      selection="single"
      value={mode}
      onValueChange={setMode}
    />
  );
}
