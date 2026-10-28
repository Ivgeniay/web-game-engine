import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import styles from './IconButtonVariantsExample.module.css';

const SETTINGS_LABEL = 'Settings';
const SETTINGS_SHORTCUT = 'Ctrl+,';
const ADD_LABEL = 'Add';
const SEARCH_LABEL = 'Search';
const CLOSE_LABEL = 'Close';

export function IconButtonVariantsExample() {
  return (
    <div className={styles.root}>
      <IconButton
        label={SETTINGS_LABEL}
        icon={frameworkIcons.settings}
        shortcut={SETTINGS_SHORTCUT}
      />
      <IconButton label={ADD_LABEL} icon={frameworkIcons.plus} variant="default" />
      <IconButton label={SEARCH_LABEL} icon={frameworkIcons.search} variant="accent" />
      <IconButton label={CLOSE_LABEL} icon={frameworkIcons.close} disabled />
    </div>
  );
}
