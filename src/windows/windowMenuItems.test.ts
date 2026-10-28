import { describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineWindow } from '@/core/windows/windowType';
import type { DockAdapter, DockWindow } from '@/core/windows/workspace';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { registerWindowMenuItems } from './windowMenuItems';

const messages = defineMessages({
  en: { scene: 'Scene', game: 'Game' },
  ru: { scene: 'Сцена', game: 'Игра' },
});

function EmptyWindow() {
  return null;
}

const sceneWindow = defineWindow({
  id: 'test.scene',
  title: messageRef(messages, 'scene'),
  component: EmptyWindow,
});

const gameWindow = defineWindow({
  id: 'test.game',
  title: messageRef(messages, 'game'),
  component: EmptyWindow,
});

const WINDOW_MENU = { menuPath: 'window', group: 10 };

function createDock(): DockAdapter {
  let windows: DockWindow[] = [];

  return {
    getWindows: () => windows,
    getActiveWindowId: () => windows.at(-1)?.id ?? null,
    getGroupWindowIds: () => windows.map(({ id }) => id),
    addWindow(window) {
      windows = [...windows, window];
    },
    activateWindow: () => undefined,
    closeWindow: () => undefined,
    applyLayout: () => undefined,
    maximizeWindow: () => undefined,
    restoreMaximized: () => undefined,
    isMaximized: () => false,
    subscribe: () => () => undefined,
  };
}

function itemPaths(editor: EditorRegistries): string[] {
  return editor.mainMenu.getEntries().map(({ path }) => path);
}

function runItem(editor: EditorRegistries, path: string): boolean {
  const entry = editor.mainMenu.getEntries().find((candidate) => candidate.path === path);

  return entry?.kind === 'command' && entry.binding.execute(editor.commands, 'menu', undefined);
}

describe('registerWindowMenuItems', () => {
  it('adds an item for every registered window type in registration order', () => {
    const editor = createEditorRegistries();
    editor.windows.register(sceneWindow);
    editor.windows.register(gameWindow);
    registerWindowMenuItems(editor, WINDOW_MENU);

    expect(itemPaths(editor)).toEqual(['window/test.scene', 'window/test.game']);
    expect(editor.mainMenu.getEntries().map(({ order }) => order)).toEqual([0, 1]);
  });

  it('follows window types registered and removed later', () => {
    const editor = createEditorRegistries();
    registerWindowMenuItems(editor, WINDOW_MENU);
    const unregisterGame = editor.windows.register(gameWindow);

    expect(itemPaths(editor)).toEqual(['window/test.game']);

    unregisterGame();

    expect(itemPaths(editor)).toEqual([]);
  });

  it('opens the window through the workspace', () => {
    const editor = createEditorRegistries();
    editor.windows.register(sceneWindow);
    registerWindowMenuItems(editor, WINDOW_MENU);

    expect(runItem(editor, 'window/test.scene')).toBe(false);

    editor.workspace.attach(createDock());

    expect(runItem(editor, 'window/test.scene')).toBe(true);
    expect(editor.workspace.isOpen(sceneWindow)).toBe(true);
  });

  it('removes its items and commands when cancelled', () => {
    const editor = createEditorRegistries();
    editor.windows.register(sceneWindow);
    const cancel = registerWindowMenuItems(editor, WINDOW_MENU);
    cancel();
    editor.windows.register(gameWindow);

    expect(itemPaths(editor)).toEqual([]);
    expect(editor.commands.getHandledCommands()).toEqual([]);
  });
});
