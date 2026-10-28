import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Label } from '@/ui/label/Label';
import { Menu } from '@/ui/menu/Menu';
import type { MenuActionItem, MenuItem } from '@/ui/menu/menuItems';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import styles from './ToolbarMenuExample.module.css';

const TOOLBAR_LABEL = 'Hierarchy';
const ADD_LABEL = 'Add object';
const SEARCH_LABEL = 'Search';
const SEARCH_SHORTCUT = 'Ctrl+F';
const NOTHING_ADDED = 'Nothing added yet';

export function ToolbarMenuExample() {
  const [lastAdded, setLastAdded] = useState(NOTHING_ADDED);

  function addAction(id: string, label: string): MenuActionItem {
    return {
      kind: 'action',
      id,
      label,
      onSelect: () => {
        setLastAdded(label);
      },
    };
  }

  const addItems: readonly MenuItem[] = [
    { ...addAction('empty', 'Empty object'), shortcut: 'Ctrl+Shift+N' },
    {
      kind: 'submenu',
      id: 'shape',
      label: 'Shape',
      items: [
        addAction('cube', 'Cube'),
        addAction('sphere', 'Sphere'),
        addAction('plane', 'Plane'),
      ],
    },
    {
      kind: 'submenu',
      id: 'light',
      label: 'Light',
      items: [addAction('directional', 'Directional light'), addAction('point', 'Point light')],
    },
    { kind: 'separator', id: 'separator' },
    { ...addAction('camera', 'Camera'), icon: frameworkIcons.eye },
  ];

  return (
    <Toolbar label={TOOLBAR_LABEL} className={styles.root}>
      <Menu
        items={addItems}
        trigger={(triggerProps) => (
          <IconButton {...triggerProps} label={ADD_LABEL} icon={frameworkIcons.plus} />
        )}
      />
      <IconButton label={SEARCH_LABEL} icon={frameworkIcons.search} shortcut={SEARCH_SHORTCUT} />
      <Label tone="secondary" truncate className={styles.choice}>
        {lastAdded}
      </Label>
    </Toolbar>
  );
}
