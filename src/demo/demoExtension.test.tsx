import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import type { Unsubscribe } from '@/core/unsubscribe';
import { EditorFrame } from '@/shell/EditorFrame';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { installDemo } from './demoExtension';
import { DemoStoresContext, createDemoStores } from './demoStores';
import type { DemoStores } from './demoStores';

class FakeResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

let stopHotkeys: Unsubscribe | null = null;

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  stopHotkeys?.();
  stopHotkeys = null;
  cleanup();
  vi.unstubAllGlobals();
});

function playModeStatus(): string | null {
  return within(screen.getByRole('contentinfo')).getByRole('status').textContent;
}

async function renderDemo(): Promise<{ editor: TestEditor; stores: DemoStores }> {
  const editor = createTestEditor();
  const stores = createDemoStores();
  installDemo(stores)(editor.registries);
  stopHotkeys = startHotkeyController({
    commands: editor.registries.commands,
    target: document,
    platform: 'other',
    areGlobalHotkeysBlocked: () => false,
  });
  render(
    <TestEditorProviders editor={editor}>
      <DemoStoresContext value={stores}>
        <EditorFrame />
      </DemoStoresContext>
    </TestEditorProviders>,
  );
  await waitFor(() => {
    expect(editor.registries.workspace.isAttached()).toBe(true);
  });

  return { editor, stores };
}

describe('demo integration', () => {
  it('opens the windows in the classic layout', async () => {
    const { editor } = await renderDemo();

    expect(editor.registries.workspace.getWindows().map(({ id }) => id)).toEqual([
      'demo.hierarchy',
      'demo.scene',
      'demo.game',
      'demo.project',
      'demo.inspector',
    ]);
  });

  it('fills the menu bar, the toolbar and the status bar', async () => {
    await renderDemo();
    const menuBar = screen.getByRole('menubar');
    const toolbar = screen.getByRole('toolbar');

    expect(
      within(menuBar)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['File', 'Edit', 'GameObject', 'Window']);
    expect(within(toolbar).getByRole('button', { name: 'Play' })).toBeDefined();
    expect(within(toolbar).getByRole('button', { name: 'Move tool' })).toBeDefined();
    expect(playModeStatus()).toBe('Edit mode');
  });

  it('enters Play mode from the toolbar', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(within(screen.getByRole('toolbar')).getByRole('button', { name: 'Play' }));

    expect(stores.playMode.getState().mode).toBe('play');
    expect(playModeStatus()).toBe('Play modeFrame 0');
  });

  it('deletes the selected object with Delete only inside the hierarchy', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(screen.getByRole('button', { name: 'Player' }));
    await user.click(within(screen.getByRole('toolbar')).getByRole('button', { name: 'Play' }));
    await user.keyboard('{Delete}');

    expect(stores.scene.getState().objects.map(({ name }) => name)).toContain('Player');

    await user.click(screen.getByRole('button', { name: 'Player' }));
    await user.keyboard('{Delete}');

    expect(stores.scene.getState().objects.map(({ name }) => name)).not.toContain('Player');
  });

  it('switches the tool with its shortcut', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();
    act(() => {
      document.body.focus();
    });

    await user.keyboard('e');

    expect(stores.scene.getState().tool).toBe('rotate');
  });
});
