import { useMemo, useState } from 'react';
import type { DragData } from '@/ui/dragAndDrop/dragData';
import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeDropTarget } from '@/ui/treeView/treeDrop';
import type { TreeModel } from '@/ui/treeView/treeModel';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './TreeViewDragExample.module.css';

const TREE_LABEL = 'Hierarchy';
const OBJECT_TYPE = 'example.scene-object';
const ROOT = '';

type Children = Readonly<Record<string, readonly string[]>>;

const INITIAL_CHILDREN: Children = {
  [ROOT]: ['level', 'player', 'enemies'],
  level: ['ground', 'walls'],
  player: [],
  enemies: ['goblin', 'troll'],
};

const NAMES: Readonly<Record<string, string>> = {
  level: 'Level',
  ground: 'Ground',
  walls: 'Walls',
  player: 'Player',
  enemies: 'Enemies',
  goblin: 'Goblin',
  troll: 'Troll',
};

function parentOf(children: Children, id: string): string {
  return Object.keys(children).find((parent) => children[parent]?.includes(id)) ?? ROOT;
}

function moveNodes(children: Children, ids: readonly string[], target: TreeDropTarget): Children {
  const moving = new Set(ids);
  const withoutMoved = Object.fromEntries(
    Object.entries(children).map(([parent, list]) => [
      parent,
      list.filter((id) => !moving.has(id)),
    ]),
  );

  if (target.kind === 'root' || target.position === 'inside') {
    const parent = target.kind === 'root' ? ROOT : target.id;

    return { ...withoutMoved, [parent]: [...(withoutMoved[parent] ?? []), ...ids] };
  }

  const parent = parentOf(children, target.id);
  const siblings = withoutMoved[parent] ?? [];
  const index = siblings.indexOf(target.id) + (target.position === 'after' ? 1 : 0);

  return {
    ...withoutMoved,
    [parent]: [...siblings.slice(0, index), ...ids, ...siblings.slice(index)],
  };
}

export function TreeViewDragExample() {
  const [children, setChildren] = useState(INITIAL_CHILDREN);
  const state = useTreeViewState({ expandedIds: ['level', 'enemies'] });

  const model = useMemo<TreeModel>(
    () => ({
      rootIds: children[ROOT] ?? [],
      getChildren: (id) => children[id] ?? [],
      hasChildren: (id) => (children[id]?.length ?? 0) > 0,
      getLabel: (id) => NAMES[id] ?? id,
    }),
    [children],
  );

  return (
    <TreeView
      aria-label={TREE_LABEL}
      className={styles.tree}
      model={model}
      selectionMode="multiple"
      dragType={OBJECT_TYPE}
      onDropData={(data: DragData, target) => {
        setChildren((current) => moveNodes(current, data.ids, target));
      }}
      {...state}
    />
  );
}
