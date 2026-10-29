import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Label } from '@/ui/label/Label';
import type { MenuItem } from '@/ui/menu/menuItems';
import { SplitButton } from '@/ui/splitButton/SplitButton';
import styles from './SplitButtonExample.module.css';

const BUILD_LABEL = 'Build';
const BUILD_MENU_LABEL = 'Build options';
const ADD_LABEL = 'Add cube';
const ADD_MENU_LABEL = 'Add another object';
const LAST_CAPTION = 'Last action:';

export function SplitButtonExample() {
  const [lastAction, setLastAction] = useState('none');

  function remember(action: string): () => void {
    return () => {
      setLastAction(action);
    };
  }

  const buildItems: readonly MenuItem[] = [
    { kind: 'action', id: 'clean', label: 'Clean build', onSelect: remember('clean build') },
    { kind: 'action', id: 'run', label: 'Build and run', onSelect: remember('build and run') },
  ];
  const addItems: readonly MenuItem[] = [
    { kind: 'action', id: 'sphere', label: 'Sphere', onSelect: remember('add sphere') },
    { kind: 'action', id: 'light', label: 'Point light', onSelect: remember('add light') },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <SplitButton
          label={BUILD_LABEL}
          variant="accent"
          onClick={remember('build')}
          menuLabel={BUILD_MENU_LABEL}
          menuItems={buildItems}
        />
        <SplitButton
          label={ADD_LABEL}
          icon={frameworkIcons.plus}
          onClick={remember('add cube')}
          menuLabel={ADD_MENU_LABEL}
          menuItems={addItems}
        />
      </div>
      <Label tone="secondary">{`${LAST_CAPTION} ${lastAction}`}</Label>
    </div>
  );
}
