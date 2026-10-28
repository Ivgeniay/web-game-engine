import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import styles from './TooltipGroupExample.module.css';

const ADD_LABEL = 'Add object';
const ADD_SHORTCUT = 'Ctrl+Shift+N';
const SEARCH_LABEL = 'Search';
const SEARCH_SHORTCUT = 'Ctrl+F';
const FILTER_LABEL = 'Filter by type';
const REFRESH_LABEL = 'Refresh';
const SETTINGS_LABEL = 'Settings';

export function TooltipGroupExample() {
  return (
    <div className={styles.root}>
      <IconButton label={ADD_LABEL} icon={frameworkIcons.plus} shortcut={ADD_SHORTCUT} />
      <IconButton label={SEARCH_LABEL} icon={frameworkIcons.search} shortcut={SEARCH_SHORTCUT} />
      <IconButton label={FILTER_LABEL} icon={frameworkIcons.filter} />
      <IconButton label={REFRESH_LABEL} icon={frameworkIcons.refresh} />
      <IconButton label={SETTINGS_LABEL} icon={frameworkIcons.settings} />
    </div>
  );
}
