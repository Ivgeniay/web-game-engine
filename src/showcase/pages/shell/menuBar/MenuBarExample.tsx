import { useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/state/registries/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { MenuBar } from '@/shell/MenuBar';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './MenuBarExample.module.css';

const engineMessages = defineMessages({
  en: {
    file: 'File',
    edit: 'Edit',
    view: 'View',
    newScene: 'New scene',
    saveScene: 'Save scene',
    export: 'Export',
    exportPng: 'Image',
    exportGltf: 'Model',
    undo: 'Undo',
    grid: 'Show grid',
    change: 'Change the scene',
    lastCommand: 'Last command: {name}',
    noCommand: 'Open a menu with the mouse, F10 or Alt',
  },
  ru: {
    file: 'Файл',
    edit: 'Правка',
    view: 'Вид',
    newScene: 'Новая сцена',
    saveScene: 'Сохранить сцену',
    export: 'Экспорт',
    exportPng: 'Изображение',
    exportGltf: 'Модель',
    undo: 'Отменить',
    grid: 'Показать сетку',
    change: 'Изменить сцену',
    lastCommand: 'Последняя команда: {name}',
    noCommand: 'Откройте меню мышью, F10 или Alt',
  },
});

const pluginMessages = defineMessages({
  en: { publish: 'Publish to the store' },
  ru: { publish: 'Опубликовать в магазине' },
});

const newScene = defineCommand({ id: 'scene.new', label: messageRef(engineMessages, 'newScene') });
const saveScene = defineCommand({
  id: 'scene.save',
  label: messageRef(engineMessages, 'saveScene'),
  icon: frameworkIcons.file,
  shortcut: { keys: 'Mod+KeyS' },
});
const exportPng = defineCommand({
  id: 'scene.exportPng',
  label: messageRef(engineMessages, 'exportPng'),
});
const exportGltf = defineCommand({
  id: 'scene.exportGltf',
  label: messageRef(engineMessages, 'exportGltf'),
});
const undo = defineCommand({
  id: 'edit.undo',
  label: messageRef(engineMessages, 'undo'),
  shortcut: { keys: 'Mod+KeyZ' },
});
const toggleGrid = defineCommand({ id: 'view.grid', label: messageRef(engineMessages, 'grid') });
const publish = defineCommand({
  id: 'plugin.publish',
  label: messageRef(pluginMessages, 'publish'),
});

interface MockEngine {
  readonly onRun: (label: MessageRef) => void;
  readonly hasChanges: () => boolean;
  readonly setChanges: (changed: boolean) => void;
  readonly gridVisible: () => boolean;
  readonly toggleGrid: () => void;
}

function engineExtension(engine: MockEngine): EditorExtension {
  return ({ mainMenu, commands }) => {
    const runs = (label: MessageRef) => ({
      run: () => {
        engine.onRun(label);
      },
    });

    return combineUnsubscribes(
      mainMenu.registerMenu({
        path: 'file',
        label: messageRef(engineMessages, 'file'),
        group: 0,
        order: 0,
      }),
      mainMenu.registerMenu({
        path: 'edit',
        label: messageRef(engineMessages, 'edit'),
        group: 0,
        order: 10,
      }),
      mainMenu.registerMenu({
        path: 'view',
        label: messageRef(engineMessages, 'view'),
        group: 0,
        order: 20,
      }),
      mainMenu.registerItem({ path: 'file/new', command: newScene, group: 0, order: 0 }),
      mainMenu.registerItem({ path: 'file/save', command: saveScene, group: 0, order: 10 }),
      mainMenu.registerMenu({
        path: 'file/export',
        label: messageRef(engineMessages, 'export'),
        group: 10,
        order: 0,
      }),
      mainMenu.registerItem({ path: 'file/export/png', command: exportPng, group: 0, order: 0 }),
      mainMenu.registerItem({ path: 'file/export/gltf', command: exportGltf, group: 0, order: 10 }),
      mainMenu.registerItem({ path: 'edit/undo', command: undo, group: 0, order: 0 }),
      mainMenu.registerItem({ path: 'view/grid', command: toggleGrid, group: 0, order: 0 }),
      commands.handle(newScene, runs(newScene.label)),
      commands.handle(saveScene, runs(saveScene.label)),
      commands.handle(exportPng, runs(exportPng.label)),
      commands.handle(exportGltf, runs(exportGltf.label)),
      commands.handle(undo, {
        run: () => {
          engine.setChanges(false);
          engine.onRun(undo.label);
          commands.refresh();
        },
        isEnabled: () => engine.hasChanges(),
      }),
      commands.handle(toggleGrid, {
        run: () => {
          engine.toggleGrid();
          engine.onRun(toggleGrid.label);
        },
        isChecked: () => engine.gridVisible(),
      }),
    );
  };
}

function pluginExtension(onRun: (label: MessageRef) => void): EditorExtension {
  return ({ mainMenu, commands }) =>
    combineUnsubscribes(
      mainMenu.registerItem({ path: 'file/publish', command: publish, group: 20, order: 0 }),
      commands.handle(publish, {
        run: () => {
          onRun(publish.label);
        },
      }),
    );
}

export function MenuBarExample() {
  const t = useMessages(engineMessages);
  const translate = useTranslate();
  const [lastCommand, setLastCommand] = useState<MessageRef | null>(null);
  const [example] = useState(() => {
    const editor = createEditorRegistries();
    let changed = false;
    let gridVisible = true;
    const engine: MockEngine = {
      onRun: setLastCommand,
      hasChanges: () => changed,
      setChanges: (value) => {
        changed = value;
      },
      gridVisible: () => gridVisible,
      toggleGrid: () => {
        gridVisible = !gridVisible;
      },
    };
    engineExtension(engine)(editor);
    pluginExtension(setLastCommand)(editor);

    return { editor, engine };
  });

  return (
    <RegistriesProvider registries={example.editor}>
      <div className={styles.root}>
        <MenuBar className={styles.menuBar} />
        <div className={styles.status}>
          <Button
            onClick={() => {
              example.engine.setChanges(true);
              example.editor.commands.refresh();
            }}
          >
            {t('change')}
          </Button>
          <Label tone="secondary">
            {lastCommand === null
              ? t('noCommand')
              : t('lastCommand', { name: translate(lastCommand) })}
          </Label>
        </div>
      </div>
    </RegistriesProvider>
  );
}
