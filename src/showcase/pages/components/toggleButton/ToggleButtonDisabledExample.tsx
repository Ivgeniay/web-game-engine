import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import styles from './ToggleButtonDisabledExample.module.css';

const PRESSED_LABEL = 'Pressed';
const RELEASED_LABEL = 'Released';

function ignorePress() {
  return undefined;
}

export function ToggleButtonDisabledExample() {
  return (
    <div className={styles.root}>
      <ToggleButton pressed onPressedChange={ignorePress} disabled>
        {PRESSED_LABEL}
      </ToggleButton>
      <ToggleButton pressed={false} onPressedChange={ignorePress} disabled>
        {RELEASED_LABEL}
      </ToggleButton>
    </div>
  );
}
