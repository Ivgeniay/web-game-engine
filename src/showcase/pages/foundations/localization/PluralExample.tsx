import { useId, useState } from 'react';
import { defineMessages } from '@/core/i18n/messages';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import { NumberField } from '@/ui/numberField/NumberField';
import styles from './PluralExample.module.css';

const INITIAL_COUNT = 1;
const MIN_COUNT = 0;
const COUNT_STEP = 0.5;

const selectionMessages = defineMessages({
  en: {
    countLabel: 'Count',
    objects: { one: '{count} object selected', other: '{count} objects selected' },
  },
  ru: {
    countLabel: 'Количество',
    objects: {
      one: 'Выбран {count} объект',
      few: 'Выбрано {count} объекта',
      many: 'Выбрано {count} объектов',
      other: 'Выбрано {count} объекта',
    },
  },
});

export function PluralExample() {
  const t = useMessages(selectionMessages);
  const invalidMessages = useNumberFieldMessages({ min: MIN_COUNT });
  const [count, setCount] = useState(INITIAL_COUNT);
  const inputId = useId();

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <Label htmlFor={inputId}>{t('countLabel')}</Label>
        <NumberField
          id={inputId}
          className={styles.input}
          value={count}
          min={MIN_COUNT}
          step={COUNT_STEP}
          updateMode="live"
          invalidMessages={invalidMessages}
          onValueChange={setCount}
        />
      </div>
      <output htmlFor={inputId}>{t('objects', { count })}</output>
    </div>
  );
}
