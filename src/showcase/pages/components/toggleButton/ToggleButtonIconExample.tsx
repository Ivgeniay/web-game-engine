import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import styles from './ToggleButtonIconExample.module.css';

const VISIBILITY_LABEL = 'Show hidden objects';
const LOCK_LABEL = 'Lock selection';

export function ToggleButtonIconExample() {
  const [showHidden, setShowHidden] = useState(false);
  const [locked, setLocked] = useState(true);

  return (
    <div className={styles.root}>
      <ToggleButton
        pressed={showHidden}
        onPressedChange={setShowHidden}
        icon={showHidden ? frameworkIcons.eye : frameworkIcons['eye-off']}
        label={VISIBILITY_LABEL}
        variant="flat"
      />
      <ToggleButton
        pressed={locked}
        onPressedChange={setLocked}
        icon={locked ? frameworkIcons.lock : frameworkIcons.unlock}
        label={LOCK_LABEL}
        variant="flat"
        size="sm"
      />
    </div>
  );
}
