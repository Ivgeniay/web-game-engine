import { frameworkIcons } from '@/icons/frameworkIcons';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import styles from './IconExample.module.css';

const CLOSE_LABEL = 'Close';
const WARNING_TEXT = 'Unsaved changes';

export function IconExample() {
  return (
    <div className={styles.root}>
      <IconButton label={CLOSE_LABEL} icon={frameworkIcons.close} variant="default" size="lg" />
      <IconButton label={CLOSE_LABEL} icon={frameworkIcons.close} variant="default" size="sm" />
      <span className={styles.message}>
        <span className={styles.warning}>
          <Icon icon={frameworkIcons.warning} />
        </span>
        {WARNING_TEXT}
      </span>
    </div>
  );
}
