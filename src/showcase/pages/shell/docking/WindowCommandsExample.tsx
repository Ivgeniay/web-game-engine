import { useEffect, useRef, useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import type { EditorExtension } from '@/state/registries/editorExtension';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowType } from '@/core/windows/windowType';
import { DockLayout } from '@/layout/DockLayout';
import { isKeyboardCapturedByPopup } from '@/shell/popupKeyboardCapture';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { usePlatform } from '@/state/platform/platformContext';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useRegistration } from '@/state/registries/useRegistration';
import { Button } from '@/ui/button/Button';
import { Kbd } from '@/ui/kbd/Kbd';
import { Label } from '@/ui/label/Label';
import styles from './WindowCommandsExample.module.css';

const exampleMessages = defineMessages({
  en: {
    scene: 'Scene',
    hierarchy: 'Hierarchy',
    openWindows: 'Open the windows',
    frameSelected: 'Frame selected',
    deleteObject: 'Delete the object',
    runs: 'Done {count} times',
  },
  ru: {
    scene: 'Сцена',
    hierarchy: 'Иерархия',
    openWindows: 'Открыть окна',
    frameSelected: 'Показать выделенное',
    deleteObject: 'Удалить объект',
    runs: 'Выполнено раз: {count}',
  },
});

const SCENE_WINDOW_ID = 'example.scene';
const HIERARCHY_WINDOW_ID = 'example.hierarchy';

const frameSelected = defineCommand({
  id: 'scene.frameSelected',
  label: messageRef(exampleMessages, 'frameSelected'),
  shortcut: { keys: 'KeyF', scope: SCENE_WINDOW_ID },
});

const deleteObject = defineCommand({
  id: 'hierarchy.delete',
  label: messageRef(exampleMessages, 'deleteObject'),
  shortcut: { keys: 'Delete', scope: HIERARCHY_WINDOW_ID },
});

interface CommandCounterProps {
  readonly command: CommandDefinition;
}

function CommandCounter({ command }: CommandCounterProps) {
  const t = useMessages(exampleMessages);
  const translate = useTranslate();
  const format = useFormatShortcut();
  const [count, setCount] = useState(0);

  useRegistration(
    ({ commands }) =>
      commands.handle(command, {
        run() {
          setCount((previous) => previous + 1);
        },
      }),
    [command],
  );

  return (
    <div className={styles.content}>
      <span className={styles.shortcut}>
        <Label tone="secondary">{translate(command.label)}</Label>
        {command.shortcut !== undefined && <Kbd>{format(command.shortcut.keys)}</Kbd>}
      </span>
      <Label>{t('runs', { count })}</Label>
    </div>
  );
}

function SceneWindow() {
  return <CommandCounter command={frameSelected} />;
}

function HierarchyWindow() {
  return <CommandCounter command={deleteObject} />;
}

const sceneWindow = defineWindow({
  id: SCENE_WINDOW_ID,
  title: messageRef(exampleMessages, 'scene'),
  component: SceneWindow,
});

const hierarchyWindow = defineWindow({
  id: HIERARCHY_WINDOW_ID,
  title: messageRef(exampleMessages, 'hierarchy'),
  component: HierarchyWindow,
});

const EXAMPLE_WINDOWS: readonly WindowType[] = [hierarchyWindow, sceneWindow];

const windowsExtension: EditorExtension = ({ windows }) =>
  combineUnsubscribes(...EXAMPLE_WINDOWS.map((windowType) => windows.register(windowType)));

export function WindowCommandsExample() {
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    windowsExtension(registries);

    return registries;
  });
  const platform = usePlatform();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return undefined;
    }

    return startHotkeyController({
      commands: editor.commands,
      target: root,
      platform,
      areGlobalHotkeysBlocked: () => isKeyboardCapturedByPopup(document),
    });
  }, [editor, platform]);

  return (
    <RegistriesProvider registries={editor}>
      <div ref={rootRef} className={styles.root}>
        <OpenWindowsButton />
        <DockLayout className={styles.dock} />
      </div>
    </RegistriesProvider>
  );
}

function OpenWindowsButton() {
  const { workspace } = useEditorRegistries();
  const t = useMessages(exampleMessages);

  function openWindows(): void {
    for (const windowType of EXAMPLE_WINDOWS) {
      workspace.open(windowType);
    }
  }

  return (
    <div className={styles.actions}>
      <Button onClick={openWindows}>{t('openWindows')}</Button>
    </div>
  );
}
