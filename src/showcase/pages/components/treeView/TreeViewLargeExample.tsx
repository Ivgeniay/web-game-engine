import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeModel } from '@/ui/treeView/treeModel';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './TreeViewLargeExample.module.css';

const TREE_LABEL = 'Generated objects';
const GROUP_COUNT = 100;
const GROUP_SIZE = 100;
const CHILD_SEPARATOR = '/';

const GROUP_IDS = Array.from({ length: GROUP_COUNT }, (_, group) => `Group ${String(group)}`);

const LARGE_TREE: TreeModel = {
  rootIds: GROUP_IDS,
  getChildren: (id) =>
    Array.from({ length: GROUP_SIZE }, (_, child) => `${id}${CHILD_SEPARATOR}${String(child)}`),
  hasChildren: (id) => !id.includes(CHILD_SEPARATOR),
  getLabel: (id) => {
    const [group, child] = id.split(CHILD_SEPARATOR);

    return child === undefined ? (group ?? id) : `Object ${child}`;
  },
};

export function TreeViewLargeExample() {
  const state = useTreeViewState({ expandedIds: GROUP_IDS });

  return (
    <TreeView
      aria-label={TREE_LABEL}
      className={styles.tree}
      model={LARGE_TREE}
      selectionMode="multiple"
      {...state}
    />
  );
}
