import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { ComponentHeader } from '@/ui/componentHeader/ComponentHeader';
import { Label } from '@/ui/label/Label';
import type { MenuItem } from '@/ui/menu/menuItems';
import styles from './ComponentHeaderExample.module.css';

const TITLE = 'Light';
const ENABLED_LABEL = 'Enable Light';
const HELP_LABEL = 'Open the Light help';
const MENU_LABEL = 'Light menu';
const RESET = 'Reset';
const REMOVE = 'Remove component';
const INTENSITY = 'Intensity';
const NO_ACTION = 'No action yet';

export function ComponentHeaderExample() {
  const [expanded, setExpanded] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [lastAction, setLastAction] = useState(NO_ACTION);

  const menuItems: readonly MenuItem[] = [
    {
      kind: 'action',
      id: 'reset',
      label: RESET,
      icon: frameworkIcons.reset,
      onSelect: () => {
        setLastAction(RESET);
      },
    },
    { kind: 'separator', id: 'separator' },
    {
      kind: 'action',
      id: 'remove',
      label: REMOVE,
      onSelect: () => {
        setLastAction(REMOVE);
      },
    },
  ];

  return (
    <div className={styles.root}>
      <ComponentHeader
        title={TITLE}
        icon={frameworkIcons.settings}
        expanded={expanded}
        onExpandedChange={setExpanded}
        enabled={enabled}
        enabledLabel={ENABLED_LABEL}
        onEnabledChange={setEnabled}
        helpLabel={HELP_LABEL}
        onHelp={() => {
          setLastAction(HELP_LABEL);
        }}
        menuItems={menuItems}
        menuLabel={MENU_LABEL}
      >
        <div className={styles.body}>
          <Label tone={enabled ? 'primary' : 'secondary'}>{INTENSITY}</Label>
        </div>
      </ComponentHeader>
      <Label tone="secondary">{lastAction}</Label>
    </div>
  );
}
