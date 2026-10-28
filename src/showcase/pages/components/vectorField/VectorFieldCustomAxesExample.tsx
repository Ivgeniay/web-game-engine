import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import type { VectorAxis } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './VectorFieldCustomAxesExample.module.css';

const FIELD_LABEL = 'Tiling';
const MIN_TILES = 1;
const TILING_AXES: readonly VectorAxis[] = [{ label: 'U' }, { label: 'V' }];

export function VectorFieldCustomAxesExample() {
  const invalidMessages = useNumberFieldMessages({ min: MIN_TILES });
  const [tiling, setTiling] = useState<readonly number[]>([4, 2]);

  return (
    <VectorField
      aria-label={FIELD_LABEL}
      className={styles.field}
      axes={TILING_AXES}
      kind="integer"
      min={MIN_TILES}
      value={tiling}
      invalidMessages={invalidMessages}
      onValueChange={setTiling}
    />
  );
}
