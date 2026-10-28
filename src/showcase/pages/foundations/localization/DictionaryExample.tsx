import { defineMessages } from '@/core/i18n/messages';
import { useMessages } from '@/state/language/useMessages';

const inspectorMessages = defineMessages({
  en: {
    title: 'Inspector',
    empty: 'Select an object to see its properties',
  },
  ru: {
    title: 'Инспектор',
    empty: 'Выберите объект, чтобы увидеть его свойства',
  },
});

export function DictionaryExample() {
  const t = useMessages(inspectorMessages);

  return (
    <section>
      <h3>{t('title')}</h3>
      <p>{t('empty')}</p>
    </section>
  );
}
