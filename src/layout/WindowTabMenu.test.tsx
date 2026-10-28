import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { tabsLayout } from '@/core/layout/layoutDescription';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowTabTarget } from '@/core/windows/windowType';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { DockLayout } from './DockLayout';
import { nextTabCommand, previousTabCommand } from './windowCommands';

const messages = defineMessages({
  en: { scene: 'Scene', game: 'Game', inspector: 'Inspector', lock: 'Lock' },
  ru: { scene: 'Сцена', game: 'Игра', inspector: 'Инспектор', lock: 'Закрепить' },
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

const inspectorWindow = defineWindow({
  id: 'test.inspector',
  title: messageRef(messages, 'inspector'),
  component: EmptyWindow,
  multiInstance: true,
});

const lockInspector = defineCommand<WindowTabTarget>({
  id: 'test.inspector.lock',
  label: messageRef(messages, 'lock'),
});

class FakeResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function renderEditor(): Promise<TestEditor> {
  const editor = createTestEditor();
  const { windows, workspace } = editor.registries;
  windows.register(sceneWindow);
  windows.register(gameWindow);
  windows.register(inspectorWindow);
  workspace.setDefaultLayout(tabsLayout([sceneWindow, gameWindow]));
  render(
    <TestEditorProviders editor={editor}>
      <DockLayout />
    </TestEditorProviders>,
  );
  await waitFor(() => {
    expect(workspace.isAttached()).toBe(true);
  });

  return editor;
}

function windowIds(editor: TestEditor): string[] {
  return editor.registries.workspace.getWindows().map(({ id }) => id);
}

const MENU_ITEM_SELECTOR = '[role^="menuitem"]';

function menuItemNames(): (string | null)[] {
  return [...document.querySelectorAll(MENU_ITEM_SELECTOR)].map((item) => item.textContent);
}

describe('WindowTabMenu', () => {
  it('opens from the button of the group with the framework items', async () => {
    const user = userEvent.setup();
    await renderEditor();

    await user.click(screen.getByRole('button', { name: 'Window menu' }));

    expect(menuItemNames()).toEqual(['Maximize', 'Close tab', 'Add tab']);
  });

  it('opens on a right click on a tab and closes that tab', async () => {
    const user = userEvent.setup();
    const editor = await renderEditor();

    fireEvent.contextMenu(screen.getByText('Scene'), { button: 2 });
    await user.click(await screen.findByRole('menuitem', { name: 'Close tab' }));

    await waitFor(() => {
      expect(windowIds(editor)).toEqual(['test.game']);
    });
  });

  it('opens on Shift+F10 on a focused tab', async () => {
    await renderEditor();
    const tab = screen.getByText('Game').closest('.dv-tab');

    if (tab === null) {
      throw new Error('Tab is not rendered');
    }

    fireEvent.keyDown(tab, { key: 'F10', shiftKey: true });

    expect(await screen.findByRole('menuitem', { name: 'Close tab' })).toBeDefined();
  });

  it('shows the items of the window before the framework items, even on the same path', async () => {
    const user = userEvent.setup();
    const editor = await renderEditor();
    const { commands, contextMenus, workspace } = editor.registries;
    const lock = vi.fn();
    const consoleError = vi.spyOn(console, 'error');
    commands.handle(lockInspector, { run: lock });
    contextMenus.registerItem(inspectorWindow.tabMenu, {
      path: 'maximize',
      command: lockInspector,
      group: 0,
      order: 0,
    });
    act(() => {
      workspace.open(inspectorWindow);
    });

    fireEvent.contextMenu(screen.getByText('Inspector'), { button: 2 });
    await screen.findByRole('menuitem', { name: 'Lock' });

    expect(menuItemNames()).toEqual(['Lock', 'Maximize', 'Close tab', 'Add tab']);
    expect(consoleError).not.toHaveBeenCalled();

    await user.click(screen.getByRole('menuitem', { name: 'Lock' }));

    await waitFor(() => {
      expect(lock).toHaveBeenCalledWith({
        source: 'context-menu',
        target: { windowId: 'test.inspector:1', windowType: 'test.inspector' },
      });
    });
  });

  it('adds a window to the group and disables open single-instance windows', async () => {
    const user = userEvent.setup();
    const editor = await renderEditor();

    fireEvent.contextMenu(screen.getByText('Scene'), { button: 2 });
    await waitFor(() => {
      expect(document.activeElement?.closest('[role="menu"]')).not.toBeNull();
    });
    await user.keyboard('{End}{ArrowRight}');
    const inspectorItem = await screen.findByRole('menuitem', { name: 'Inspector' });

    expect(screen.getByRole('menuitem', { name: 'Game' }).hasAttribute('disabled')).toBe(true);
    await waitFor(() => {
      expect(document.activeElement).toBe(inspectorItem);
    });

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(windowIds(editor)).toEqual(['test.scene', 'test.game', 'test.inspector:1']);
    });
  });

  it('switches the tabs of the active group in a circle', async () => {
    const editor = await renderEditor();
    const { commands, workspace } = editor.registries;
    const invocation = { source: 'hotkey', target: undefined } as const;

    act(() => {
      commands.execute(nextTabCommand, invocation);
    });

    expect(workspace.getActiveWindow()?.id).toBe('test.game');

    act(() => {
      commands.execute(nextTabCommand, invocation);
    });

    expect(workspace.getActiveWindow()?.id).toBe('test.scene');

    act(() => {
      commands.execute(previousTabCommand, invocation);
    });

    expect(workspace.getActiveWindow()?.id).toBe('test.game');
  });
});
