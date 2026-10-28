import { LANGUAGES, LANGUAGE_NAMES } from '@/core/i18n/languages';
import { useLanguageStore } from '@/state/language/useLanguageStore';
import styles from './LanguageSwitcher.module.css';

const RADIO_GROUP_NAME = 'language';
const LEGEND = 'language';

export function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>{LEGEND}</legend>
      {LANGUAGES.map((option) => (
        <label key={option} className={styles.option} lang={option}>
          <input
            className={styles.radio}
            type="radio"
            name={RADIO_GROUP_NAME}
            value={option}
            checked={language === option}
            onChange={() => {
              setLanguage(option);
            }}
          />
          {LANGUAGE_NAMES[option]}
        </label>
      ))}
    </fieldset>
  );
}
