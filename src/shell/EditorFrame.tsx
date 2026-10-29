import { useRef } from 'react';
import { DockLayout } from '@/layout/DockLayout';
import type { LayoutStorage } from '@/layout/layoutPersistence';
import { registerUndoCommands } from '@/core/undo/undoCommands';
import { useRegistration } from '@/state/registries/useRegistration';
import { ConfirmDialogHost } from './ConfirmDialogHost';
import styles from './EditorFrame.module.css';
import {
  WORKSPACE_FOCUS_REGION,
  focusRegionProps,
  registerFocusRegionCommands,
} from './focusRegions';
import { MainToolbar } from './MainToolbar';
import { MenuBar } from './MenuBar';
import { StatusBar } from './StatusBar';

interface EditorFrameProps {
  readonly layoutStorage?: LayoutStorage | undefined;
}

const MENU_FOCUS_REGION = 'menu';
const TOOLBAR_FOCUS_REGION = 'toolbar';
const STATUS_BAR_FOCUS_REGION = 'status-bar';

export function EditorFrame({ layoutStorage }: EditorFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useRegistration((editor) => registerFocusRegionCommands(editor, () => rootRef.current), []);
  useRegistration(({ commands, undo }) => registerUndoCommands(commands, undo), []);

  return (
    <div ref={rootRef} className={styles.root}>
      <header className={styles.header}>
        <div {...focusRegionProps(MENU_FOCUS_REGION)}>
          <MenuBar />
        </div>
        <div {...focusRegionProps(TOOLBAR_FOCUS_REGION)}>
          <MainToolbar />
        </div>
      </header>
      <main className={styles.workspace} {...focusRegionProps(WORKSPACE_FOCUS_REGION)}>
        <DockLayout layoutStorage={layoutStorage} />
      </main>
      <div {...focusRegionProps(STATUS_BAR_FOCUS_REGION)}>
        <StatusBar />
      </div>
      <ConfirmDialogHost />
    </div>
  );
}
