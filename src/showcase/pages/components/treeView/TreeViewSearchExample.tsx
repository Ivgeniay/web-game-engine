import { useRef, useState } from 'react';
import { SearchField } from '@/ui/searchField/SearchField';
import { TreeView } from '@/ui/treeView/TreeView';
import type { TreeModel } from '@/ui/treeView/treeModel';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './TreeViewSearchExample.module.css';

const TREE_LABEL = 'Hierarchy';
const SEARCH_LABEL = 'Search the hierarchy';
const CLEAR_LABEL = 'Clear search';

const CHILDREN: Readonly<Record<string, readonly string[]>> = {
  city: ['streets', 'buildings'],
  streets: ['lamp-1', 'lamp-2'],
  buildings: ['house', 'tower'],
  tower: ['lamp-3'],
};

const NAMES: Readonly<Record<string, string>> = {
  city: 'City',
  streets: 'Streets',
  buildings: 'Buildings',
  house: 'House',
  tower: 'Tower',
  'lamp-1': 'Street Lamp',
  'lamp-2': 'Street Lamp',
  'lamp-3': 'Beacon Lamp',
  sky: 'Sky',
};

const CITY_TREE: TreeModel = {
  rootIds: ['city', 'sky'],
  getChildren: (id) => CHILDREN[id] ?? [],
  hasChildren: (id) => id in CHILDREN,
  getLabel: (id) => NAMES[id] ?? id,
};

export function TreeViewSearchExample() {
  const [query, setQuery] = useState('');
  const treeRef = useRef<HTMLDivElement>(null);
  const state = useTreeViewState({ expandedIds: ['city'] });

  return (
    <div className={styles.root}>
      <SearchField
        label={SEARCH_LABEL}
        clearLabel={CLEAR_LABEL}
        value={query}
        onValueChange={setQuery}
        resultsRef={treeRef}
      />
      <TreeView
        ref={treeRef}
        aria-label={TREE_LABEL}
        className={styles.tree}
        model={CITY_TREE}
        filter={query}
        selectionMode="multiple"
        {...state}
      />
    </div>
  );
}
