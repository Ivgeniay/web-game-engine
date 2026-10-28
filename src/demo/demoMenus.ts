import { defineCommand } from '@/core/commands/command';
import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { resetLayoutCommand } from '@/layout/layoutCommands';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { registerWindowMenuItems } from '@/windows/windowMenuItems';
import { demoMessages } from './demoMessages';

const saveSceneCommand = defineCommand({
  id: 'file.saveScene',
  label: messageRef(demoMessages, 'saveScene'),
  shortcut: { keys: 'Mod+KeyS' },
});

const undoCommand = defineCommand({
  id: 'edit.undo',
  label: messageRef(demoMessages, 'undo'),
  shortcut: { keys: 'Mod+KeyZ' },
});

const redoCommand = defineCommand({
  id: 'edit.redo',
  label: messageRef(demoMessages, 'redo'),
  shortcut: { keys: 'Mod+Shift+KeyZ' },
});

const TOP_MENUS = [
  { path: 'file', label: messageRef(demoMessages, 'file') },
  { path: 'edit', label: messageRef(demoMessages, 'edit') },
  { path: 'gameObject', label: messageRef(demoMessages, 'gameObject') },
  { path: 'window', label: messageRef(commonMessages, 'window') },
];

const TOP_MENU_GROUP = 0;
const OPEN_WINDOWS_GROUP = 0;
const LAYOUT_GROUP = 10;

export function registerDemoMenus(editor: EditorRegistries): Unsubscribe {
  const { commands, mainMenu } = editor;

  return combineUnsubscribes(
    ...TOP_MENUS.map(({ path, label }, order) =>
      mainMenu.registerMenu({ path, label, group: TOP_MENU_GROUP, order }),
    ),
    commands.handle(saveSceneCommand, { run: () => undefined }),
    commands.handle(undoCommand, { run: () => undefined, isEnabled: () => false }),
    commands.handle(redoCommand, { run: () => undefined, isEnabled: () => false }),
    mainMenu.registerItem({ path: 'file/save', command: saveSceneCommand, group: 0, order: 0 }),
    mainMenu.registerItem({ path: 'edit/undo', command: undoCommand, group: 0, order: 0 }),
    mainMenu.registerItem({ path: 'edit/redo', command: redoCommand, group: 0, order: 10 }),
    registerWindowMenuItems(editor, { menuPath: 'window', group: OPEN_WINDOWS_GROUP }),
    mainMenu.registerItem({
      path: 'window/resetLayout',
      command: resetLayoutCommand,
      group: LAYOUT_GROUP,
      order: 0,
    }),
  );
}
