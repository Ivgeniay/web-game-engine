import { LANGUAGES, LANGUAGE_NAMES } from '@/core/i18n/languages';
import type { Language } from '@/core/i18n/languages';
import { useLanguageStore } from '@/state/language/useLanguageStore';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './switcher.module.css';

const CAPTION = 'language';

const LANGUAGE_OPTIONS: readonly ToggleButtonGroupOption<Language>[] = LANGUAGES.map(
  (language) => ({ value: language, label: LANGUAGE_NAMES[language], lang: language }),
);

export function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div className={styles.root}>
      <span className={styles.caption} aria-hidden="true">
        {CAPTION}
      </span>
      <ToggleButtonGroup
        label={CAPTION}
        options={LANGUAGE_OPTIONS}
        selection="single"
        value={language}
        onValueChange={setLanguage}
        size="sm"
      />
    </div>
  );
}
