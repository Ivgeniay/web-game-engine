import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import styles from './SelectToolbarExample.module.css';

type Shading = 'shaded' | 'wireframe' | 'shaded-wireframe';

const TOOLBAR_LABEL = 'Scene view';
const SHADING_LABEL = 'Shading mode';
const SETTINGS_LABEL = 'View settings';

const SHADING_OPTIONS: readonly SelectEntry<Shading>[] = [
  { kind: 'option', value: 'shaded', label: 'Shaded' },
  { kind: 'option', value: 'wireframe', label: 'Wireframe' },
  { kind: 'option', value: 'shaded-wireframe', label: 'Shaded wireframe' },
];

export function SelectToolbarExample() {
  const [shading, setShading] = useState<Shading>('shaded');

  return (
    <Toolbar label={TOOLBAR_LABEL} className={styles.root}>
      <Select
        aria-label={SHADING_LABEL}
        options={SHADING_OPTIONS}
        value={shading}
        onValueChange={setShading}
        variant="flat"
        size="sm"
      />
      <IconButton label={SETTINGS_LABEL} icon={frameworkIcons.settings} size="sm" />
    </Toolbar>
  );
}
