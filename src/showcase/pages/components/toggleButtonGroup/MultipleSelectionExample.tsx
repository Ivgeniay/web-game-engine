import { useState } from 'react';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './MultipleSelectionExample.module.css';

type Axis = 'x' | 'y' | 'z';

const GROUP_LABEL = 'Locked axes';

const AXIS_OPTIONS: readonly ToggleButtonGroupOption<Axis>[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'z', label: 'Z', disabled: true },
];

export function MultipleSelectionExample() {
  const [axes, setAxes] = useState<readonly Axis[]>(['y']);

  return (
    <div className={styles.root}>
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={AXIS_OPTIONS}
        selection="multiple"
        value={axes}
        onValueChange={setAxes}
        size="sm"
      />
    </div>
  );
}
