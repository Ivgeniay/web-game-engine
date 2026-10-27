import { THEME_MODES } from '@/state/theme/themeMode';
import { useThemeStore } from '@/state/theme/useThemeStore';
import styles from './ThemeModeExample.module.css';

const GROUP_LABEL = 'Theme mode';

export function ThemeModeExample() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <div className={styles.root} role="group" aria-label={GROUP_LABEL}>
      {THEME_MODES.map((option) => (
        <button
          key={option}
          className={styles.button}
          type="button"
          aria-pressed={option === mode}
          onClick={() => {
            setMode(option);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
