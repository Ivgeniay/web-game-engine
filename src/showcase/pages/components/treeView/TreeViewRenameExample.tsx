import { useMemo, useState } from 'react';
import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeModel } from '@/ui/treeView/treeModel';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './TreeViewRenameExample.module.css';

const TREE_LABEL = 'Hierarchy';
const RENAME_LABEL = 'Object name';
const EMPTY_NAME_MESSAGE = 'The name cannot be empty';

const CHILDREN: Readonly<Record<string, readonly string[]>> = {
  level: ['ground', 'walls'],
  enemies: ['goblin', 'troll'],
};

const INITIAL_NAMES: Readonly<Record<string, string>> = {
  level: 'Level',
  ground: 'Ground',
  walls: 'Walls',
  enemies: 'Enemies',
  goblin: 'Goblin',
  troll: 'Troll',
};

function validateName(name: string): string | undefined {
  return name.trim() === '' ? EMPTY_NAME_MESSAGE : undefined;
}

export function TreeViewRenameExample() {
  const [names, setNames] = useState(INITIAL_NAMES);
  const state = useTreeViewState({ expandedIds: ['level', 'enemies'] });

  const model = useMemo<TreeModel>(
    () => ({
      rootIds: ['level', 'enemies'],
      getChildren: (id) => CHILDREN[id] ?? [],
      hasChildren: (id) => id in CHILDREN,
      getLabel: (id) => names[id] ?? id,
    }),
    [names],
  );

  return (
    <TreeView
      aria-label={TREE_LABEL}
      className={styles.tree}
      model={model}
      renameLabel={RENAME_LABEL}
      validateName={validateName}
      onRename={(id, name) => {
        setNames((current) => ({ ...current, [id]: name }));
      }}
      {...state}
    />
  );
}
