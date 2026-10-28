import { useState, useSyncExternalStore } from 'react';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowContentProps, WindowType } from '@/core/windows/windowType';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { DockLayout } from '@/layout/DockLayout';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import styles from './OpenWindowsExample.module.css';

const exampleMessages = defineMessages({
  en: {
    project: 'Project',
    animation: 'Animation',
    inspector: 'Inspector',
    open: 'Open {name}',
    closeActive: 'Close the active window',
    maximize: 'Maximize the active window',
    windowId: 'Window id: {id}',
  },
  ru: {
    project: 'Проект',
    animation: 'Анимация',
    inspector: 'Инспектор',
    open: 'Открыть: {name}',
    closeActive: 'Закрыть активное окно',
    maximize: 'Развернуть активное окно',
    windowId: 'Идентификатор окна: {id}',
  },
});

function WindowIdContent({ windowId }: WindowContentProps) {
  const t = useMessages(exampleMessages);

  return (
    <div className={styles.content}>
      <Label tone="secondary">{t('windowId', { id: windowId })}</Label>
    </div>
  );
}

const projectWindow = defineWindow({
  id: 'example.project',
  title: messageRef(exampleMessages, 'project'),
  icon: frameworkIcons.folder,
  component: WindowIdContent,
});

const animationWindow = defineWindow({
  id: 'example.animation',
  title: messageRef(exampleMessages, 'animation'),
  icon: frameworkIcons['list-view'],
  component: WindowIdContent,
});

const inspectorWindow = defineWindow({
  id: 'example.inspector',
  title: messageRef(exampleMessages, 'inspector'),
  icon: frameworkIcons.info,
  component: WindowIdContent,
  multiInstance: true,
});

const EXAMPLE_WINDOWS: readonly WindowType[] = [projectWindow, animationWindow, inspectorWindow];

const windowsExtension: EditorExtension = ({ windows }) =>
  combineUnsubscribes(...EXAMPLE_WINDOWS.map((windowType) => windows.register(windowType)));

export function OpenWindowsExample() {
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    windowsExtension(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <ExampleWorkspace />
    </RegistriesProvider>
  );
}

function ExampleWorkspace() {
  const { workspace } = useEditorRegistries();
  useSyncExternalStore(workspace.subscribe, workspace.getVersion);
  const t = useMessages(exampleMessages);
  const translate = useTranslate();
  const activeWindow = workspace.getActiveWindow();

  function closeActiveWindow(): void {
    if (activeWindow !== null) {
      workspace.close(activeWindow.id);
    }
  }

  function toggleMaximized(maximized: boolean): void {
    if (!maximized) {
      workspace.restore();
    } else if (activeWindow !== null) {
      workspace.maximize(activeWindow.id);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        {EXAMPLE_WINDOWS.map((windowType) => (
          <Button
            key={windowType.id}
            onClick={() => {
              workspace.open(windowType);
            }}
          >
            {t('open', { name: translate(windowType.title) })}
          </Button>
        ))}
        <Button disabled={activeWindow === null} onClick={closeActiveWindow}>
          {t('closeActive')}
        </Button>
        <ToggleButton
          pressed={workspace.isMaximized()}
          onPressedChange={toggleMaximized}
          disabled={activeWindow === null}
        >
          {t('maximize')}
        </ToggleButton>
      </div>
      <DockLayout className={styles.dock} />
    </div>
  );
}
