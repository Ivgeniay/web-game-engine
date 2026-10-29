import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { useListViewState } from '@/ui/listView/useListViewState';
import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeModel } from '@/ui/treeView/treeModel';
import styles from './TreeViewControlledExample.module.css';

const TREE_LABEL = 'Project';
const EXPAND_ALL = 'Expand all';
const COLLAPSE_ALL = 'Collapse all';

const FOLDERS: Readonly<Record<string, readonly string[]>> = {
  Assets: ['Assets/Scenes', 'Assets/Scripts', 'Assets/Textures'],
  'Assets/Scenes': ['Assets/Scenes/Main.scene'],
  'Assets/Scripts': ['Assets/Scripts/Player.ts', 'Assets/Scripts/Enemy.ts'],
  'Assets/Textures': ['Assets/Textures/Grass.png'],
};

const FOLDER_IDS = Object.keys(FOLDERS);
const NOTHING_EXPANDED: readonly string[] = [];

const PROJECT_TREE: TreeModel = {
  rootIds: ['Assets'],
  getChildren: (id) => FOLDERS[id] ?? [],
  hasChildren: (id) => id in FOLDERS,
  getLabel: (id) => id.slice(id.lastIndexOf('/') + 1),
  getIcon: (id, expanded) => {
    if (!(id in FOLDERS)) {
      return frameworkIcons.file;
    }

    return expanded ? frameworkIcons['folder-open'] : frameworkIcons.folder;
  },
};

export function TreeViewControlledExample() {
  const selection = useListViewState();
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(['Assets']);

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            setExpandedIds(FOLDER_IDS);
          }}
        >
          {EXPAND_ALL}
        </Button>
        <Button
          onClick={() => {
            setExpandedIds(NOTHING_EXPANDED);
          }}
        >
          {COLLAPSE_ALL}
        </Button>
      </div>
      <TreeView
        aria-label={TREE_LABEL}
        className={styles.tree}
        model={PROJECT_TREE}
        {...selection}
        expandedIds={expandedIds}
        onExpandedIdsChange={setExpandedIds}
      />
    </div>
  );
}
