import { useState } from 'react';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowContentProps } from '@/core/windows/windowType';
import { DockLayout } from '@/layout/DockLayout';
import { resetLayoutCommand } from '@/layout/layoutCommands';
import { createLayoutStorage } from '@/layout/layoutPersistence';
import { ConfirmDialogHost } from '@/shell/ConfirmDialogHost';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { browserStorage } from '@/state/stores/browserStores';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './LayoutExample.module.css';

const exampleMessages = defineMessages({
  en: {
    hierarchy: 'Hierarchy',
    scene: 'Scene',
    game: 'Game',
    inspector: 'Inspector',
    resetLayout: 'Reset layout',
    reload: 'Reload the example',
    hint: 'Drag tabs and dividers, then reload the example',
  },
  ru: {
    hierarchy: 'Иерархия',
    scene: 'Сцена',
    game: 'Игра',
    inspector: 'Инспектор',
    resetLayout: 'Сбросить раскладку',
    reload: 'Перезагрузить пример',
    hint: 'Перетащите вкладки и разделители, затем перезагрузите пример',
  },
});

const EXAMPLE_LAYOUT_KEY = 'showcase-layout-example';

function EmptyWindow({ windowId }: WindowContentProps) {
  return <div className={styles.content}>{windowId}</div>;
}

const hierarchyWindow = defineWindow({
  id: 'example.hierarchy',
  title: messageRef(exampleMessages, 'hierarchy'),
  component: EmptyWindow,
});
const sceneWindow = defineWindow({
  id: 'example.scene',
  title: messageRef(exampleMessages, 'scene'),
  component: EmptyWindow,
});
const gameWindow = defineWindow({
  id: 'example.game',
  title: messageRef(exampleMessages, 'game'),
  component: EmptyWindow,
});
const inspectorWindow = defineWindow({
  id: 'example.inspector',
  title: messageRef(exampleMessages, 'inspector'),
  component: EmptyWindow,
});

const defaultLayout = splitLayout('row', [
  tabsLayout([hierarchyWindow], { weight: 1 }),
  tabsLayout([sceneWindow, gameWindow], { weight: 3 }),
  tabsLayout([inspectorWindow], { weight: 1 }),
]);

const layoutExtension: EditorExtension = ({ windows, workspace }) =>
  combineUnsubscribes(
    windows.register(hierarchyWindow),
    windows.register(sceneWindow),
    windows.register(gameWindow),
    windows.register(inspectorWindow),
    workspace.setDefaultLayout(defaultLayout),
  );

const layoutStorage = createLayoutStorage(browserStorage, EXAMPLE_LAYOUT_KEY);

export function LayoutExample() {
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    layoutExtension(registries);

    return registries;
  });
  const [mountCount, setMountCount] = useState(0);

  function reload(): void {
    setMountCount((count) => count + 1);
  }

  return (
    <RegistriesProvider registries={editor}>
      <div className={styles.root}>
        <LayoutActions onReload={reload} />
        <DockLayout key={mountCount} className={styles.dock} layoutStorage={layoutStorage} />
      </div>
      <ConfirmDialogHost />
    </RegistriesProvider>
  );
}

interface LayoutActionsProps {
  readonly onReload: () => void;
}

function LayoutActions({ onReload }: LayoutActionsProps) {
  const { commands } = useEditorRegistries();
  const t = useMessages(exampleMessages);

  function resetLayout(): void {
    commands.execute(resetLayoutCommand, { source: 'code', target: undefined });
  }

  return (
    <div className={styles.actions}>
      <Button onClick={resetLayout}>{t('resetLayout')}</Button>
      <Button onClick={onReload}>{t('reload')}</Button>
      <Label tone="secondary">{t('hint')}</Label>
    </div>
  );
}
