import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import styles from './ButtonWithIconExample.module.css';

const ADD_LABEL = 'Add component';
const REFRESH_LABEL = 'Refresh';

export function ButtonWithIconExample() {
  return (
    <div className={styles.root}>
      <Button icon={frameworkIcons.plus}>{ADD_LABEL}</Button>
      <Button icon={frameworkIcons.refresh} size="sm" variant="flat">
        {REFRESH_LABEL}
      </Button>
    </div>
  );
}
