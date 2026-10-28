import { Button } from '@/ui/button/Button';
import styles from './ButtonDisabledExample.module.css';

const CANCEL_LABEL = 'Cancel';
const BUILD_LABEL = 'Build';
const RELOAD_LABEL = 'Reload';

export function ButtonDisabledExample() {
  return (
    <div className={styles.root}>
      <Button disabled>{CANCEL_LABEL}</Button>
      <Button variant="accent" disabled>
        {BUILD_LABEL}
      </Button>
      <Button variant="flat" disabled>
        {RELOAD_LABEL}
      </Button>
    </div>
  );
}
