import { DockLayout } from '@/layout/DockLayout';
import { ConfirmDialogHost } from './ConfirmDialogHost';
import styles from './EditorFrame.module.css';
import { MainToolbar } from './MainToolbar';
import { MenuBar } from './MenuBar';
import { StatusBar } from './StatusBar';

export function EditorFrame() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <MenuBar />
        <MainToolbar />
      </header>
      <main className={styles.workspace}>
        <DockLayout />
      </main>
      <StatusBar />
      <ConfirmDialogHost />
    </div>
  );
}
