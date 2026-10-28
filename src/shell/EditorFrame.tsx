import { DockLayout } from '@/layout/DockLayout';
import type { LayoutStorage } from '@/layout/layoutPersistence';
import { ConfirmDialogHost } from './ConfirmDialogHost';
import styles from './EditorFrame.module.css';
import { MainToolbar } from './MainToolbar';
import { MenuBar } from './MenuBar';
import { StatusBar } from './StatusBar';

interface EditorFrameProps {
  readonly layoutStorage?: LayoutStorage | undefined;
}

export function EditorFrame({ layoutStorage }: EditorFrameProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <MenuBar />
        <MainToolbar />
      </header>
      <main className={styles.workspace}>
        <DockLayout layoutStorage={layoutStorage} />
      </main>
      <StatusBar />
      <ConfirmDialogHost />
    </div>
  );
}
