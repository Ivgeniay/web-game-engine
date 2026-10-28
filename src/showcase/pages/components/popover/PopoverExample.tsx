import { useId, useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Label } from '@/ui/label/Label';
import { Popover } from '@/ui/popover/Popover';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import styles from './PopoverExample.module.css';

type Shading = 'shaded' | 'wireframe' | 'shaded-wireframe';

const TRIGGER_LABEL = 'View';
const PANEL_LABEL = 'View settings';
const GRID_LABEL = 'Show grid';
const GIZMOS_LABEL = 'Show gizmos';
const SHADING_LABEL = 'Shading';

const SHADING_OPTIONS: readonly SelectEntry<Shading>[] = [
  { kind: 'option', value: 'shaded', label: 'Shaded' },
  { kind: 'option', value: 'wireframe', label: 'Wireframe' },
  { kind: 'option', value: 'shaded-wireframe', label: 'Shaded wireframe' },
];

export function PopoverExample() {
  const shadingLabelId = useId();
  const [showGrid, setShowGrid] = useState(true);
  const [showGizmos, setShowGizmos] = useState(false);
  const [shading, setShading] = useState<Shading>('shaded');

  return (
    <div className={styles.root}>
      <Popover
        label={PANEL_LABEL}
        className={styles.panel}
        trigger={(triggerProps) => (
          <Button {...triggerProps} icon={frameworkIcons.settings}>
            {TRIGGER_LABEL}
          </Button>
        )}
      >
        <Checkbox checked={showGrid} onCheckedChange={setShowGrid} label={GRID_LABEL} />
        <Checkbox checked={showGizmos} onCheckedChange={setShowGizmos} label={GIZMOS_LABEL} />
        <div className={styles.row}>
          <Label id={shadingLabelId} tone="secondary">
            {SHADING_LABEL}
          </Label>
          <Select
            aria-labelledby={shadingLabelId}
            options={SHADING_OPTIONS}
            value={shading}
            onValueChange={setShading}
          />
        </div>
      </Popover>
    </div>
  );
}
