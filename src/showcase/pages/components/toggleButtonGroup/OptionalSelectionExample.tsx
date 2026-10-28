import { useState } from 'react';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './OptionalSelectionExample.module.css';

type Snapping = 'grid' | 'surface' | 'vertex';

const GROUP_LABEL = 'Snapping';

const SNAPPING_OPTIONS: readonly ToggleButtonGroupOption<Snapping>[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'surface', label: 'Surface' },
  { value: 'vertex', label: 'Vertex' },
];

export function OptionalSelectionExample() {
  const [snapping, setSnapping] = useState<Snapping | null>(null);

  return (
    <div className={styles.root}>
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={SNAPPING_OPTIONS}
        selection="optional"
        value={snapping}
        onValueChange={setSnapping}
      />
    </div>
  );
}
