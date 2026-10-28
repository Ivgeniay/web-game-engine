import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import styles from './IconButtonSizesExample.module.css';

const MORE_LABEL = 'More';

export function IconButtonSizesExample() {
  return (
    <div className={styles.root}>
      <IconButton label={MORE_LABEL} icon={frameworkIcons['more-vertical']} size="sm" />
      <IconButton label={MORE_LABEL} icon={frameworkIcons['more-vertical']} size="md" />
      <IconButton label={MORE_LABEL} icon={frameworkIcons['more-vertical']} size="lg" />
    </div>
  );
}
