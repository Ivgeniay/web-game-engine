import { LANGUAGES, LANGUAGE_NAMES } from '@/core/i18n/languages';
import type { Language } from '@/core/i18n/languages';
import { useLanguageStore } from '@/state/language/useLanguageStore';
import { useMessages } from '@/state/language/useMessages';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import { showcaseMessages } from './showcaseMessages';
import styles from './switcher.module.css';

const LANGUAGE_OPTIONS: readonly ToggleButtonGroupOption<Language>[] = LANGUAGES.map(
  (language) => ({ value: language, label: LANGUAGE_NAMES[language], lang: language }),
);

export function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const caption = useMessages(showcaseMessages)('languageCaption');

  return (
    <div className={styles.root}>
      <span className={styles.caption} aria-hidden="true">
        {caption}
      </span>
      <ToggleButtonGroup
        label={caption}
        options={LANGUAGE_OPTIONS}
        selection="single"
        value={language}
        onValueChange={setLanguage}
        size="sm"
      />
    </div>
  );
}
