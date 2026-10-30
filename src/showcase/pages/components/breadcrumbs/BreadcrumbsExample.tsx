import { useState } from 'react';
import { Breadcrumbs } from '@/ui/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@/ui/breadcrumbs/Breadcrumbs';
import { Button } from '@/ui/button/Button';
import styles from './BreadcrumbsExample.module.css';

const PATH_LABEL = 'Folder path';
const MORE_LABEL = 'Show hidden folders';
const DEEPER_LABEL = 'Open a subfolder';
const FOLDERS = ['Assets', 'Art', 'Environment', 'Forest', 'Trees', 'Pine', 'Textures'];

export function BreadcrumbsExample() {
  const [depth, setDepth] = useState(FOLDERS.length);
  const items: readonly BreadcrumbItem[] = FOLDERS.slice(0, depth).map((label, index) => ({
    id: String(index),
    label,
  }));

  return (
    <div className={styles.root}>
      <Breadcrumbs
        className={styles.path}
        label={PATH_LABEL}
        moreLabel={MORE_LABEL}
        items={items}
        onNavigate={(id) => {
          setDepth(Number(id) + 1);
        }}
      />
      <Button
        disabled={depth === FOLDERS.length}
        onClick={() => {
          setDepth((current) => current + 1);
        }}
      >
        {DEEPER_LABEL}
      </Button>
    </div>
  );
}
