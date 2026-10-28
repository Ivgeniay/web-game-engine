import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './VectorFieldMixedExample.module.css';

const FIELD_LABEL = 'Position of selected objects';

export function VectorFieldMixedExample() {
  const invalidMessages = useNumberFieldMessages();
  const [position, setPosition] = useState<readonly number[]>([0, 0, 2]);
  const [mixed, setMixed] = useState<readonly boolean[]>([true, false, true]);

  return (
    <VectorField
      aria-label={FIELD_LABEL}
      className={styles.field}
      axes={VECTOR3_AXES}
      value={position}
      mixed={mixed}
      invalidMessages={invalidMessages}
      onValueChange={(next, phase) => {
        if (phase !== 'cancel') {
          setMixed(mixed.map((isMixed, index) => isMixed && next[index] === position[index]));
        }

        setPosition(next);
      }}
    />
  );
}
