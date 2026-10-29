import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeModel } from '@/ui/treeView/treeModel';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './TreeViewExample.module.css';

const TREE_LABEL = 'Hierarchy';

interface SceneNode {
  readonly name: string;
  readonly children: readonly string[];
}

const NODES: Readonly<Record<string, SceneNode>> = {
  camera: { name: 'Main Camera', children: [] },
  light: { name: 'Directional Light', children: [] },
  environment: { name: 'Environment', children: ['terrain', 'trees'] },
  terrain: { name: 'Terrain', children: [] },
  trees: { name: 'Trees', children: ['oak', 'pine'] },
  oak: { name: 'Oak', children: [] },
  pine: { name: 'Pine', children: [] },
  player: { name: 'Player', children: ['model', 'weapon'] },
  model: { name: 'Model', children: [] },
  weapon: { name: 'Weapon', children: [] },
};

const SCENE_TREE: TreeModel = {
  rootIds: ['camera', 'light', 'environment', 'player'],
  getChildren: (id) => NODES[id]?.children ?? [],
  hasChildren: (id) => (NODES[id]?.children.length ?? 0) > 0,
  getLabel: (id) => NODES[id]?.name ?? id,
};

export function TreeViewExample() {
  const state = useTreeViewState({ expandedIds: ['environment'], selectedIds: ['terrain'] });

  return (
    <TreeView
      aria-label={TREE_LABEL}
      className={styles.tree}
      model={SCENE_TREE}
      selectionMode="multiple"
      {...state}
    />
  );
}
