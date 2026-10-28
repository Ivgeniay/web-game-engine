import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Label } from '@/ui/label/Label';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem, MenuPoint } from '@/ui/menu/menuItems';
import styles from './ContextMenuExample.module.css';

const MENU_LABEL = 'Scene object';
const AREA_HINT = 'Right-click anywhere in this area';
const NOTHING_CHOSEN = 'Nothing chosen yet';

export function ContextMenuExample() {
  const [point, setPoint] = useState<MenuPoint | null>(null);
  const [lastChoice, setLastChoice] = useState(NOTHING_CHOSEN);

  const items: readonly MenuItem[] = [
    {
      kind: 'action',
      id: 'copy',
      label: 'Copy',
      icon: frameworkIcons.copy,
      shortcut: 'Ctrl+C',
      onSelect: () => {
        setLastChoice('Copy');
      },
    },
    {
      kind: 'action',
      id: 'paste',
      label: 'Paste',
      shortcut: 'Ctrl+V',
      disabled: true,
      onSelect: () => {
        setLastChoice('Paste');
      },
    },
    {
      kind: 'action',
      id: 'duplicate',
      label: 'Duplicate',
      shortcut: 'Ctrl+D',
      onSelect: () => {
        setLastChoice('Duplicate');
      },
    },
    { kind: 'separator', id: 'separator' },
    {
      kind: 'action',
      id: 'rename',
      label: 'Rename',
      shortcut: 'F2',
      onSelect: () => {
        setLastChoice('Rename');
      },
    },
  ];

  return (
    <div
      className={styles.root}
      onContextMenu={(event) => {
        event.preventDefault();
        setPoint({ x: event.clientX, y: event.clientY });
      }}
    >
      <Label tone="secondary">{AREA_HINT}</Label>
      <Label>{lastChoice}</Label>
      <Menu
        label={MENU_LABEL}
        items={items}
        point={point}
        onClose={() => {
          setPoint(null);
        }}
      />
    </div>
  );
}
