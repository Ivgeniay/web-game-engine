import { THEME_MODES } from '@/state/theme/themeMode';
import { useThemeStore } from '@/state/theme/useThemeStore';
import styles from './ThemeSwitcher.module.css';

const RADIO_GROUP_NAME = 'theme-mode';
const LEGEND = 'theme';

export function ThemeSwitcher() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>{LEGEND}</legend>
      {THEME_MODES.map((option) => (
        <label key={option} className={styles.option}>
          <input
            className={styles.radio}
            type="radio"
            name={RADIO_GROUP_NAME}
            value={option}
            checked={mode === option}
            onChange={() => {
              setMode(option);
            }}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
