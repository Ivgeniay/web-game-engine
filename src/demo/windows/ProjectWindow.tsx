import { useRef, useState } from 'react';
import { demoMessages } from '@/demo/demoMessages';
import { PROJECT_ROOT_ID, PROJECT_TREE } from '@/demo/project/projectAssets';
import { useMessages } from '@/state/language/useMessages';
import { SearchField } from '@/ui/searchField/SearchField';
import { TreeView } from '@/ui/treeView/TreeView';
import { useTreeViewState } from '@/ui/treeView/useTreeViewState';
import styles from './DemoWindow.module.css';

export function ProjectWindow() {
  const t = useMessages(demoMessages);
  const [query, setQuery] = useState('');
  const treeRef = useRef<HTMLDivElement>(null);
  const state = useTreeViewState({ expandedIds: [PROJECT_ROOT_ID] });

  return (
    <div className={styles.fill}>
      <div className={styles.search}>
        <SearchField
          label={t('searchProject')}
          clearLabel={t('clearSearch')}
          value={query}
          onValueChange={setQuery}
          resultsRef={treeRef}
        />
      </div>
      <TreeView
        ref={treeRef}
        aria-label={t('project')}
        className={styles.tree}
        model={PROJECT_TREE}
        filter={query}
        selectionMode="multiple"
        {...state}
      />
    </div>
  );
}
