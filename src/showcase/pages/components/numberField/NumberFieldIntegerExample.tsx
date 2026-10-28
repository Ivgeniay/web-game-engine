import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { NumberField } from '@/ui/numberField/NumberField';
import styles from './NumberFieldIntegerExample.module.css';

const FIELD_LABEL = 'Render queue';
const MIN_QUEUE = 1000;
const MAX_QUEUE = 5000;
const QUEUE_STEP = 10;

export function NumberFieldIntegerExample() {
  const invalidMessages = useNumberFieldMessages({ min: MIN_QUEUE, max: MAX_QUEUE });
  const [queue, setQueue] = useState(2000);

  return (
    <NumberField
      aria-label={FIELD_LABEL}
      className={styles.field}
      kind="integer"
      value={queue}
      min={MIN_QUEUE}
      max={MAX_QUEUE}
      step={QUEUE_STEP}
      invalidMessages={invalidMessages}
      onValueChange={setQueue}
    />
  );
}
