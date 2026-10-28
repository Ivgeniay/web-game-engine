import { useState } from 'react';
import { RadioGroup } from '@/ui/radioGroup/RadioGroup';
import type { RadioGroupOption } from '@/ui/radioGroup/RadioGroup';
import styles from './RadioGroupExample.module.css';

type Projection = 'perspective' | 'orthographic';

const GROUP_LABEL = 'Projection';

const PROJECTION_OPTIONS: readonly RadioGroupOption<Projection>[] = [
  { value: 'perspective', label: 'Perspective' },
  { value: 'orthographic', label: 'Orthographic' },
];

export function RadioGroupExample() {
  const [projection, setProjection] = useState<Projection>('perspective');

  return (
    <div className={styles.root}>
      <RadioGroup
        label={GROUP_LABEL}
        options={PROJECTION_OPTIONS}
        value={projection}
        onValueChange={setProjection}
      />
    </div>
  );
}
