import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { NumberField } from '@/ui/numberField/NumberField';
import styles from './NumberFieldStatesExample.module.css';

const MIXED_LABEL = 'Mass of selected objects';
const READ_ONLY_LABEL = 'Vertex count';
const DISABLED_LABEL = 'Drag';
const VERTEX_COUNT = 24;

export function NumberFieldStatesExample() {
  const invalidMessages = useNumberFieldMessages();
  const [mass, setMass] = useState(1);
  const [mixed, setMixed] = useState(true);

  return (
    <div className={styles.root}>
      <NumberField
        aria-label={MIXED_LABEL}
        className={styles.field}
        value={mass}
        mixed={mixed}
        invalidMessages={invalidMessages}
        onValueChange={(value) => {
          setMass(value);
          setMixed(false);
        }}
      />
      <NumberField
        aria-label={READ_ONLY_LABEL}
        className={styles.field}
        kind="integer"
        value={VERTEX_COUNT}
        invalidMessages={invalidMessages}
        readOnly
      />
      <NumberField
        aria-label={DISABLED_LABEL}
        className={styles.field}
        value={0}
        invalidMessages={invalidMessages}
        disabled
      />
    </div>
  );
}
