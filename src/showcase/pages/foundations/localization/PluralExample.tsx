import { useId, useState } from 'react';
import { defineMessages } from '@/core/i18n/messages';
import { useMessages } from '@/state/language/useMessages';
import styles from './PluralExample.module.css';

const INITIAL_VALUE = '1';
const MIN_COUNT = 0;
const COUNT_STEP = 0.5;
const FALLBACK_COUNT = 0;

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

function parseCount(value: string): number {
  const count = Number.parseFloat(value);

  return Number.isFinite(count) ? count : FALLBACK_COUNT;
}

export function PluralExample() {
  const t = useMessages(selectionMessages);
  const [value, setValue] = useState(INITIAL_VALUE);
  const inputId = useId();

  return (
    <div className={styles.root}>
      <label className={styles.field} htmlFor={inputId}>
        {t('countLabel')}
        <input
          id={inputId}
          className={styles.input}
          type="number"
          min={MIN_COUNT}
          step={COUNT_STEP}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </label>
      <output htmlFor={inputId}>{t('objects', { count: parseCount(value) })}</output>
    </div>
  );
}
