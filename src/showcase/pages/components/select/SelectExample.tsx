import { useId, useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Label } from '@/ui/label/Label';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import styles from './SelectExample.module.css';

type ViewMode = 'list' | 'grid' | 'columns' | 'gallery';

const FIELD_LABEL = 'View mode';

const VIEW_OPTIONS: readonly SelectEntry<ViewMode>[] = [
  { kind: 'option', value: 'list', label: 'List', icon: frameworkIcons['list-view'] },
  { kind: 'option', value: 'grid', label: 'Grid', icon: frameworkIcons['grid-view'] },
  { kind: 'separator', id: 'separator' },
  { kind: 'option', value: 'columns', label: 'Columns', disabled: true },
  { kind: 'option', value: 'gallery', label: 'Gallery', icon: frameworkIcons.file },
];

export function SelectExample() {
  const labelId = useId();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className={styles.root}>
      <Label id={labelId} tone="secondary">
        {FIELD_LABEL}
      </Label>
      <Select
        aria-labelledby={labelId}
        options={VIEW_OPTIONS}
        value={viewMode}
        onValueChange={setViewMode}
      />
    </div>
  );
}
