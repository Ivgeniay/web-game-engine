import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import styles from './ClippedContainerExample.module.css';

const MORE_LABEL = 'More actions for the selected objects in this panel';

export function ClippedContainerExample() {
  return (
    <div className={styles.root}>
      <IconButton label={MORE_LABEL} icon={frameworkIcons['more-vertical']} />
    </div>
  );
}
