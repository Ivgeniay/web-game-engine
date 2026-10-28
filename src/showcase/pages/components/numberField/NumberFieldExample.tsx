import { useId, useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Label } from '@/ui/label/Label';
import { NumberField } from '@/ui/numberField/NumberField';
import styles from './NumberFieldExample.module.css';

const CAPTION = 'Mass';
const COMMITTED_CAPTION = 'Committed:';
const MIN_MASS = 0;

export function NumberFieldExample() {
  const fieldId = useId();
  const invalidMessages = useNumberFieldMessages({ min: MIN_MASS });
  const [mass, setMass] = useState(1.25);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <Label htmlFor={fieldId} tone="secondary">
          {CAPTION}
        </Label>
        <NumberField
          id={fieldId}
          className={styles.field}
          value={mass}
          min={MIN_MASS}
          invalidMessages={invalidMessages}
          onValueChange={setMass}
        />
      </div>
      <Label tone="secondary">{`${COMMITTED_CAPTION} ${String(mass)}`}</Label>
    </div>
  );
}
