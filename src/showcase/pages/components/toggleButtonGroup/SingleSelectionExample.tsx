import { useState } from 'react';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './SingleSelectionExample.module.css';

type Tool = 'move' | 'rotate' | 'scale';

const GROUP_LABEL = 'Transform tool';

const TOOL_OPTIONS: readonly ToggleButtonGroupOption<Tool>[] = [
  { value: 'move', label: 'Move' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'scale', label: 'Scale' },
];

export function SingleSelectionExample() {
  const [tool, setTool] = useState<Tool>('move');

  return (
    <div className={styles.root}>
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={TOOL_OPTIONS}
        selection="single"
        value={tool}
        onValueChange={setTool}
      />
    </div>
  );
}
