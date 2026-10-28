import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import type { ToggleButtonGroupOption } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import styles from './IconOptionsExample.module.css';

type ViewMode = 'list' | 'grid';

const GROUP_LABEL = 'View mode';

const VIEW_OPTIONS: readonly ToggleButtonGroupOption<ViewMode>[] = [
  { value: 'list', label: 'List', icon: frameworkIcons['list-view'], iconOnly: true },
  { value: 'grid', label: 'Grid', icon: frameworkIcons['grid-view'], iconOnly: true },
];

export function IconOptionsExample() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className={styles.root}>
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={VIEW_OPTIONS}
        selection="single"
        value={viewMode}
        onValueChange={setViewMode}
        variant="flat"
      />
    </div>
  );
}
