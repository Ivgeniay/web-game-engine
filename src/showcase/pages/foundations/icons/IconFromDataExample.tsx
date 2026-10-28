import { frameworkIcons } from '@/icons/frameworkIcons';
import { iconRef } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import styles from './IconFromDataExample.module.css';

const RECEIVED_ICON_NAMES = ['warning', 'chevron-right', 'teleport'];

export function IconFromDataExample() {
  return (
    <ul className={styles.root}>
      {RECEIVED_ICON_NAMES.map((name) => (
        <li key={name} className={styles.item}>
          <Icon icon={iconRef(frameworkIcons, name)} />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  );
}
