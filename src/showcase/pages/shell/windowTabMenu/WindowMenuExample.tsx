import { useState } from 'react';
import type { EditorExtension } from '@/state/registries/editorExtension';
import { commonMessages } from '@/core/i18n/commonMessages';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { DockLayout } from '@/layout/DockLayout';
import { resetLayoutCommand } from '@/layout/layoutCommands';
import { ConfirmDialogHost } from '@/shell/ConfirmDialogHost';
import { MenuBar } from '@/shell/MenuBar';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { registerWindowMenuItems } from '@/windows/windowMenuItems';
import styles from './WindowMenuExample.module.css';

const exampleMessages = defineMessages({
  en: { hierarchy: 'Hierarchy', scene: 'Scene', project: 'Project' },
  ru: { hierarchy: 'Иерархия', scene: 'Сцена', project: 'Проект' },
});

function EmptyWindow() {
  return null;
}

const hierarchyWindow = defineWindow({
  id: 'example.hierarchy',
  title: messageRef(exampleMessages, 'hierarchy'),
  icon: frameworkIcons['list-view'],
  component: EmptyWindow,
});

const sceneWindow = defineWindow({
  id: 'example.scene',
  title: messageRef(exampleMessages, 'scene'),
  component: EmptyWindow,
});

const projectWindow = defineWindow({
  id: 'example.project',
  title: messageRef(exampleMessages, 'project'),
  icon: frameworkIcons.folder,
  component: EmptyWindow,
});

const WINDOW_MENU_PATH = 'window';
const OPEN_WINDOWS_GROUP = 0;
const LAYOUT_GROUP = 10;

const windowMenuExtension: EditorExtension = (editor) =>
  combineUnsubscribes(
    editor.windows.register(hierarchyWindow),
    editor.windows.register(sceneWindow),
    editor.windows.register(projectWindow),
    editor.workspace.setDefaultLayout(
      splitLayout('row', [tabsLayout([hierarchyWindow]), tabsLayout([sceneWindow], { weight: 3 })]),
    ),
    editor.mainMenu.registerMenu({
      path: WINDOW_MENU_PATH,
      label: messageRef(commonMessages, 'window'),
      group: 0,
      order: 0,
    }),
    registerWindowMenuItems(editor, { menuPath: WINDOW_MENU_PATH, group: OPEN_WINDOWS_GROUP }),
    editor.mainMenu.registerItem({
      path: `${WINDOW_MENU_PATH}/reset-layout`,
      command: resetLayoutCommand,
      group: LAYOUT_GROUP,
      order: 0,
    }),
  );

export function WindowMenuExample() {
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    windowMenuExtension(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <div className={styles.root}>
        <MenuBar />
        <DockLayout className={styles.dock} />
      </div>
      <ConfirmDialogHost />
    </RegistriesProvider>
  );
}
