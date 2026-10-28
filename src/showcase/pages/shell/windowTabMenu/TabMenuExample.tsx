import { useState, useSyncExternalStore } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowContentProps, WindowTabTarget } from '@/core/windows/windowType';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { DockLayout } from '@/layout/DockLayout';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Label } from '@/ui/label/Label';
import styles from './TabMenuExample.module.css';

const exampleMessages = defineMessages({
  en: {
    scene: 'Scene',
    inspector: 'Inspector',
    lock: 'Lock',
    locked: 'Locked: shows the same object',
    unlocked: 'Follows the selection',
    hint: 'Right-click a tab or use the button at the right of the tabs',
  },
  ru: {
    scene: 'Сцена',
    inspector: 'Инспектор',
    lock: 'Закрепить',
    locked: 'Закреплён: показывает тот же объект',
    unlocked: 'Следует за выделением',
    hint: 'Щёлкните правой кнопкой по вкладке или нажмите кнопку справа от вкладок',
  },
});

const lockInspector = defineCommand<WindowTabTarget>({
  id: 'inspector.lock',
  label: messageRef(exampleMessages, 'lock'),
  icon: frameworkIcons.lock,
});

function SceneWindow() {
  const t = useMessages(exampleMessages);

  return (
    <div className={styles.content}>
      <Label tone="secondary">{t('hint')}</Label>
    </div>
  );
}

function InspectorWindow({ windowId }: WindowContentProps) {
  const { commands } = useEditorRegistries();
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  const t = useMessages(exampleMessages);
  const { checked } = commands.getState(lockInspector, {
    source: 'code',
    target: { windowId, windowType: inspectorWindow.id },
  });

  return (
    <div className={styles.content}>
      <Label>{checked === true ? t('locked') : t('unlocked')}</Label>
    </div>
  );
}

const sceneWindow = defineWindow({
  id: 'example.scene',
  title: messageRef(exampleMessages, 'scene'),
  component: SceneWindow,
});

const inspectorWindow = defineWindow({
  id: 'example.inspector',
  title: messageRef(exampleMessages, 'inspector'),
  component: InspectorWindow,
  multiInstance: true,
});

function inspectorExtension(): EditorExtension {
  const lockedWindows = new Set<string>();

  return ({ commands, contextMenus, windows, workspace }) =>
    combineUnsubscribes(
      windows.register(sceneWindow),
      windows.register(inspectorWindow),
      workspace.setDefaultLayout(
        splitLayout('row', [
          tabsLayout([sceneWindow], { weight: 2 }),
          tabsLayout([inspectorWindow], { weight: 1 }),
        ]),
      ),
      commands.handle(lockInspector, {
        run: ({ target }) => {
          if (!lockedWindows.delete(target.windowId)) {
            lockedWindows.add(target.windowId);
          }
          commands.refresh();
        },
        isChecked: ({ target }) => lockedWindows.has(target.windowId),
      }),
      contextMenus.registerItem(inspectorWindow.tabMenu, {
        path: 'lock',
        command: lockInspector,
        group: 0,
        order: 0,
      }),
    );
}

export function TabMenuExample() {
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    inspectorExtension()(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <DockLayout className={styles.dock} />
    </RegistriesProvider>
  );
}
