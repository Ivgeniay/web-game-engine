import type { IDockviewHeaderActionsProps } from 'dockview-react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useMessages } from '@/state/language/useMessages';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import { layoutMessages } from './layoutMessages';
import { useWindowTabMenuItems } from './useWindowTabMenuItems';
import { windowTabTargetOf } from './windowPanelParams';
import styles from './WindowTabMenu.module.css';

export function WindowTabMenu({ activePanel }: IDockviewHeaderActionsProps) {
  const messages = useMessages(layoutMessages);
  const items = useWindowTabMenuItems(
    activePanel === undefined ? null : windowTabTargetOf(activePanel),
  );

  if (activePanel === undefined) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Menu
        items={items}
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            label={messages('windowMenu')}
            icon={frameworkIcons['more-vertical']}
            size="sm"
          />
        )}
      />
    </div>
  );
}
