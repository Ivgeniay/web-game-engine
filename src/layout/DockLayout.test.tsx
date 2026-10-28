import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { HOTKEY_SCOPE_ATTRIBUTE } from '@/core/hotkeys/hotkeyScope';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { tabsLayout } from '@/core/layout/layoutDescription';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowContentProps } from '@/core/windows/windowType';
import { useMessages } from '@/state/language/useMessages';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { DockLayout } from './DockLayout';
import { resetLayoutCommand, toggleMaximizeCommand } from './layoutCommands';
import { createLayoutStorage } from './layoutPersistence';
import type { LayoutStorage } from './layoutPersistence';
import { serializeLayout, storedLayoutOf } from './layoutSerialization';

const messages = defineMessages({
  en: { scene: 'Scene', game: 'Game', frame: 'Frame selected', play: 'Play' },
  ru: { scene: 'Сцена', game: 'Игра', frame: 'Показать выделенное', play: 'Запуск' },
});

function SceneContent({ windowId }: WindowContentProps) {
  const text = useMessages(messages);

  return (
    <button type="button" data-window-id={windowId}>
      {text('play')}
    </button>
  );
}

const sceneWindow = defineWindow({
  id: 'test.scene',
  title: messageRef(messages, 'scene'),
  component: SceneContent,
});

function GameContent() {
  return null;
}

const gameWindow = defineWindow({
  id: 'test.game',
  title: messageRef(messages, 'game'),
  component: GameContent,
});

const frameSelected = defineCommand({
  id: 'test.frameSelected',
  label: messageRef(messages, 'frame'),
  shortcut: { keys: 'KeyF', scope: sceneWindow.id },
});

const OUTSIDE_LABEL = 'outside';

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
});

function renderDock(editor: TestEditor, layoutStorage?: LayoutStorage) {
  return render(
    <TestEditorProviders editor={editor}>
      <button type="button">{OUTSIDE_LABEL}</button>
      <DockLayout layoutStorage={layoutStorage} />
    </TestEditorProviders>,
  );
}

function createMemoryLayoutStorage(): LayoutStorage {
  const entries = new Map<string, string>();

  return createLayoutStorage(() => ({
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  }));
}

function windowIds(editor: TestEditor): string[] {
  return editor.registries.workspace.getWindows().map(({ id }) => id);
}

async function waitForAttach(editor: TestEditor): Promise<void> {
  await waitFor(() => {
    expect(editor.registries.workspace.isAttached()).toBe(true);
  });
}

async function openScene(editor: TestEditor): Promise<void> {
  const { workspace } = editor.registries;
  await waitFor(() => {
    expect(workspace.isAttached()).toBe(true);
  });
  act(() => {
    workspace.open(sceneWindow);
  });
}

describe('DockLayout', () => {
  it('attaches the workspace while mounted', async () => {
    const editor = createTestEditor();
    const { unmount } = renderDock(editor);

    await waitFor(() => {
      expect(editor.registries.workspace.isAttached()).toBe(true);
    });

    unmount();

    expect(editor.registries.workspace.isAttached()).toBe(false);
  });

  it('shows an opened window with its translated title and focuses it', async () => {
    const editor = createTestEditor();
    editor.registries.windows.register(sceneWindow);
    renderDock(editor);
    await openScene(editor);

    const content = await screen.findByRole('button', { name: 'Play' });
    const frame = content.closest(`[${HOTKEY_SCOPE_ATTRIBUTE}]`);

    expect(screen.getByText('Scene')).toBeDefined();
    expect(frame?.getAttribute(HOTKEY_SCOPE_ATTRIBUTE)).toBe('test.scene');
    await waitFor(() => {
      expect(document.activeElement).toBe(frame);
    });
  });

  it('retranslates the tab title when the language changes', async () => {
    const editor = createTestEditor();
    editor.registries.windows.register(sceneWindow);
    renderDock(editor);
    await openScene(editor);
    await screen.findByText('Scene');

    act(() => {
      editor.stores.language.getState().setLanguage('ru');
    });

    expect(screen.getByText('Сцена')).toBeDefined();
  });

  it('activates and focuses a window when its tab is clicked', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const { windows, workspace } = editor.registries;
    windows.register(sceneWindow);
    windows.register(gameWindow);
    renderDock(editor);
    await openScene(editor);
    act(() => {
      workspace.open(gameWindow);
    });

    expect(workspace.getActiveWindow()?.id).toBe('test.game');

    await user.click(screen.getByText('Scene'));

    await waitFor(() => {
      expect(workspace.getActiveWindow()?.id).toBe('test.scene');
    });
    expect(document.activeElement?.getAttribute(HOTKEY_SCOPE_ATTRIBUTE)).toBe('test.scene');
  });

  it('runs a window shortcut only while focus is inside that window', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    const { commands, windows } = editor.registries;
    const run = vi.fn();
    windows.register(sceneWindow);
    commands.handle(frameSelected, { run });
    const stopHotkeys = startHotkeyController({
      commands,
      target: document,
      platform: 'other',
      areGlobalHotkeysBlocked: () => false,
    });
    renderDock(editor);
    await openScene(editor);

    await user.click(await screen.findByRole('button', { name: 'Play' }));
    await user.keyboard('f');
    await user.click(screen.getByRole('button', { name: OUTSIDE_LABEL }));
    await user.keyboard('f');
    stopHotkeys();

    expect(run).toHaveBeenCalledTimes(1);
  });

  it('shows a placeholder for a window whose type is not registered', async () => {
    const editor = createTestEditor();
    const unregister = editor.registries.windows.register(sceneWindow);
    renderDock(editor);
    await openScene(editor);
    await screen.findByText('Scene');

    act(() => {
      unregister();
    });

    expect(screen.getByText('This window is not available')).toBeDefined();
  });

  it('starts with the default layout of the integration', async () => {
    const editor = createTestEditor();
    const { windows, workspace } = editor.registries;
    windows.register(sceneWindow);
    windows.register(gameWindow);
    workspace.setDefaultLayout(tabsLayout([sceneWindow, gameWindow]));
    renderDock(editor);
    await waitForAttach(editor);

    expect(windowIds(editor)).toEqual(['test.scene', 'test.game']);
  });

  it('restores the stored layout instead of the default one', async () => {
    const editor = createTestEditor();
    const { windows, workspace } = editor.registries;
    const layoutStorage = createMemoryLayoutStorage();
    const stored = serializeLayout(tabsLayout([gameWindow]));
    windows.register(sceneWindow);
    windows.register(gameWindow);
    workspace.setDefaultLayout(tabsLayout([sceneWindow, gameWindow]));
    layoutStorage.save(stored === null ? null : storedLayoutOf(stored));
    renderDock(editor, layoutStorage);
    await waitForAttach(editor);

    expect(windowIds(editor)).toEqual(['test.game']);
  });

  it('resets the layout to the default one after confirmation', async () => {
    const editor = createTestEditor();
    const { commands, dialogs, windows, workspace } = editor.registries;
    windows.register(sceneWindow);
    windows.register(gameWindow);
    workspace.setDefaultLayout(tabsLayout([sceneWindow, gameWindow]));
    renderDock(editor);
    await waitForAttach(editor);
    act(() => {
      workspace.close('test.game');
    });

    act(() => {
      commands.execute(resetLayoutCommand, { source: 'code', target: undefined });
    });
    const [request] = dialogs.store.getState().queue;

    expect(windowIds(editor)).toEqual(['test.scene']);
    expect(request?.options.destructive).toBe(true);

    await act(async () => {
      dialogs.store.getState().answer(request?.id ?? -1, 'confirm');
      await Promise.resolve();
    });

    expect(windowIds(editor)).toEqual(['test.scene', 'test.game']);
  });

  it('keeps the layout when the reset is cancelled', async () => {
    const editor = createTestEditor();
    const { commands, dialogs, windows, workspace } = editor.registries;
    windows.register(sceneWindow);
    windows.register(gameWindow);
    workspace.setDefaultLayout(tabsLayout([sceneWindow, gameWindow]));
    renderDock(editor);
    await waitForAttach(editor);
    act(() => {
      workspace.close('test.game');
      commands.execute(resetLayoutCommand, { source: 'code', target: undefined });
    });

    await act(async () => {
      const [request] = dialogs.store.getState().queue;
      dialogs.store.getState().answer(request?.id ?? -1, 'cancel');
      await Promise.resolve();
    });

    expect(windowIds(editor)).toEqual(['test.scene']);
  });

  it('maximizes the active window and restores it with one command', async () => {
    const editor = createTestEditor();
    const { commands, windows } = editor.registries;
    windows.register(sceneWindow);
    renderDock(editor);
    await openScene(editor);
    const invocation = { source: 'code', target: undefined } as const;

    act(() => {
      commands.execute(toggleMaximizeCommand, invocation);
    });

    expect(commands.getState(toggleMaximizeCommand, invocation).checked).toBe(true);

    act(() => {
      commands.execute(toggleMaximizeCommand, invocation);
    });

    expect(commands.getState(toggleMaximizeCommand, invocation).checked).toBe(false);
  });
});
