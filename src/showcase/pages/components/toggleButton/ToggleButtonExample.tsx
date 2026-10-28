import { useState } from 'react';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import styles from './ToggleButtonExample.module.css';

const GIZMOS_LABEL = 'Gizmos';
const STATS_LABEL = 'Stats';

export function ToggleButtonExample() {
  const [gizmos, setGizmos] = useState(true);
  const [stats, setStats] = useState(false);

  return (
    <div className={styles.root}>
      <ToggleButton pressed={gizmos} onPressedChange={setGizmos}>
        {GIZMOS_LABEL}
      </ToggleButton>
      <ToggleButton pressed={stats} onPressedChange={setStats} variant="flat">
        {STATS_LABEL}
      </ToggleButton>
    </div>
  );
}
