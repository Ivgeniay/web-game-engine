import { useState } from 'react';
import { RadioGroup } from '@/ui/radioGroup/RadioGroup';
import type { RadioGroupOption } from '@/ui/radioGroup/RadioGroup';
import styles from './RadioGroupHorizontalExample.module.css';

type UpAxis = 'y' | 'z';

const GROUP_LABEL = 'Up axis';

const AXIS_OPTIONS: readonly RadioGroupOption<UpAxis>[] = [
  { value: 'y', label: 'Y up' },
  { value: 'z', label: 'Z up' },
];

export function RadioGroupHorizontalExample() {
  const [upAxis, setUpAxis] = useState<UpAxis | null>(null);

  return (
    <div className={styles.root}>
      <RadioGroup
        label={GROUP_LABEL}
        options={AXIS_OPTIONS}
        value={upAxis}
        onValueChange={setUpAxis}
        orientation="horizontal"
      />
    </div>
  );
}
