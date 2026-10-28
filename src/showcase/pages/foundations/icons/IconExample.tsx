import { frameworkIcons } from '@/icons/frameworkIcons';
import { Icon } from '@/ui/icon/Icon';
import styles from './IconExample.module.css';

const CLOSE_LABEL = 'Close';
const WARNING_TEXT = 'Unsaved changes';

export function IconExample() {
  return (
    <div className={styles.root}>
      <button className={styles.button} type="button" aria-label={CLOSE_LABEL}>
        <Icon icon={frameworkIcons.close} />
      </button>
      <button className={styles.button} type="button" aria-label={CLOSE_LABEL}>
        <Icon icon={frameworkIcons.close} size="sm" />
      </button>
      <span className={styles.message}>
        <span className={styles.warning}>
          <Icon icon={frameworkIcons.warning} />
        </span>
        {WARNING_TEXT}
      </span>
    </div>
  );
}
