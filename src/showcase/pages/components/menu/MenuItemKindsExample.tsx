import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem } from '@/contracts/menu';
import styles from './MenuItemKindsExample.module.css';

const TRIGGER_LABEL = 'View';

const SHADING_OPTIONS = [
  { value: 'shaded', label: 'Shaded' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'shaded-wireframe', label: 'Shaded wireframe' },
] as const;

export function MenuItemKindsExample() {
  const [showGrid, setShowGrid] = useState(true);
  const [showGizmos, setShowGizmos] = useState(false);
  const [shading, setShading] = useState('shaded');

  const items: readonly MenuItem[] = [
    { kind: 'section', id: 'overlays', label: 'Overlays' },
    {
      kind: 'checkbox',
      id: 'grid',
      label: 'Grid',
      shortcut: 'G',
      checked: showGrid,
      onCheckedChange: setShowGrid,
    },
    {
      kind: 'checkbox',
      id: 'gizmos',
      label: 'Gizmos',
      checked: showGizmos,
      onCheckedChange: setShowGizmos,
    },
    { kind: 'separator', id: 'separator-shading' },
    { kind: 'section', id: 'shading', label: 'Shading' },
    {
      kind: 'radio-group',
      id: 'shading-mode',
      label: 'Shading',
      value: shading,
      options: SHADING_OPTIONS,
      onValueChange: setShading,
    },
    { kind: 'separator', id: 'separator-camera' },
    {
      kind: 'action',
      id: 'frame',
      label: 'Frame selected',
      icon: frameworkIcons.maximize,
      shortcut: 'F',
      onSelect: () => undefined,
    },
    {
      kind: 'action',
      id: 'reset',
      label: 'Reset camera',
      icon: frameworkIcons.reset,
      disabled: true,
      onSelect: () => undefined,
    },
    {
      kind: 'submenu',
      id: 'layout',
      label: 'Layout',
      icon: frameworkIcons.layout,
      items: [
        { kind: 'action', id: 'single', label: 'Single view', onSelect: () => undefined },
        { kind: 'action', id: 'split', label: 'Split view', onSelect: () => undefined },
      ],
    },
  ];

  return (
    <div className={styles.root}>
      <Menu
        items={items}
        trigger={(triggerProps) => (
          <Button {...triggerProps} icon={frameworkIcons['chevron-down']}>
            {TRIGGER_LABEL}
          </Button>
        )}
      />
    </div>
  );
}
