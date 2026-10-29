import type { TreeModel } from './treeModel';

const CHILDREN: Readonly<Record<string, readonly string[]>> = {
  world: ['terrain', 'props'],
  props: ['rock', 'tree'],
  player: ['camera'],
  empty: [],
};

const LABELS: Readonly<Record<string, string>> = {
  world: 'World',
  terrain: 'Terrain',
  props: 'Props',
  rock: 'Rock',
  tree: 'Tree',
  player: 'Player',
  camera: 'Camera',
  light: 'Light',
  empty: 'Empty',
};

export const TEST_TREE: TreeModel = {
  rootIds: ['world', 'player', 'light'],
  getChildren: (id) => CHILDREN[id] ?? [],
  hasChildren: (id) => id in CHILDREN,
  getLabel: (id) => LABELS[id] ?? id,
};

export const TEST_TREE_WITH_EMPTY_NODE: TreeModel = {
  ...TEST_TREE,
  rootIds: ['empty', 'light'],
};
