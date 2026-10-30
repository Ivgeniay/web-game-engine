import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useSearchableMenuLabels } from '@/state/fields/useSearchableMenuLabels';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import { SearchableMenu } from '@/ui/searchableMenu/SearchableMenu';
import type { SearchableMenuItem } from '@/ui/searchableMenu/searchableMenuModel';
import styles from './SearchableMenuExample.module.css';

const MENU_LABEL = 'Component';
const ADD_LABEL = 'Add Component';
const ADDED_LABEL = 'Added: ';
const NOTHING_ADDED = 'nothing yet';

const COMPONENTS: readonly SearchableMenuItem[] = [
  {
    id: 'audio',
    label: 'Audio',
    children: [
      { id: 'audio-source', label: 'Audio Source', icon: frameworkIcons.bell },
      { id: 'audio-listener', label: 'Audio Listener', icon: frameworkIcons.bell },
    ],
  },
  {
    id: 'physics',
    label: 'Physics',
    children: [
      { id: 'rigidbody', label: 'Rigidbody', disabled: true },
      {
        id: 'colliders',
        label: 'Colliders',
        children: [
          { id: 'box-collider', label: 'Box Collider' },
          { id: 'sphere-collider', label: 'Sphere Collider' },
          { id: 'capsule-collider', label: 'Capsule Collider' },
        ],
      },
    ],
  },
  {
    id: 'rendering',
    label: 'Rendering',
    children: [
      { id: 'camera', label: 'Camera', icon: frameworkIcons.eye },
      { id: 'light', label: 'Light', icon: frameworkIcons.info },
    ],
  },
];

function findLabel(items: readonly SearchableMenuItem[], id: string): string | undefined {
  for (const item of items) {
    const found = item.id === id ? item.label : findLabel(item.children ?? [], id);

    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
}

export function SearchableMenuExample() {
  const labels = useSearchableMenuLabels();
  const [added, setAdded] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <SearchableMenu
        label={MENU_LABEL}
        items={COMPONENTS}
        labels={labels}
        onSelect={setAdded}
        trigger={(triggerProps) => <Button {...triggerProps}>{ADD_LABEL}</Button>}
      />
      <Label tone="secondary">
        {ADDED_LABEL + (added === null ? NOTHING_ADDED : (findLabel(COMPONENTS, added) ?? added))}
      </Label>
    </div>
  );
}
