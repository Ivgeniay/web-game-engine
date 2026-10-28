import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { HOTKEY_SCOPE_ATTRIBUTE } from '@/core/hotkeys/hotkeyScope';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineWindow } from '@/core/windows/windowType';
import type { WindowContentProps } from '@/core/windows/windowType';
import { useMessages } from '@/state/language/useMessages';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { DockLayout } from './DockLayout';

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

function renderDock(editor: TestEditor) {
  return render(
    <TestEditorProviders editor={editor}>
      <button type="button">{OUTSIDE_LABEL}</button>
      <DockLayout />
    </TestEditorProviders>,
  );
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
});
