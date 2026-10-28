import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { DockAdapter, DockWindow } from '@/core/windows/workspace';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import {
  WORKSPACE_FOCUS_REGION,
  focusNextRegionCommand,
  focusPreviousRegionCommand,
  focusRegionProps,
  registerFocusRegionCommands,
} from './focusRegions';

const MENU_BUTTON = 'File';
const TOOL_BUTTON = 'Move';
const OTHER_TOOL_BUTTON = 'Rotate';
const DISABLED_BUTTON = 'Build';
const FRAME_ID = 'frame';

const SCENE_WINDOW: DockWindow = { id: 'test.scene', windowType: 'test.scene' };

afterEach(() => {
  cleanup();
});

function renderFrame(): HTMLElement {
  render(
    <div data-testid={FRAME_ID}>
      <div {...focusRegionProps('menu')}>
        <button type="button">{MENU_BUTTON}</button>
      </div>
      <div {...focusRegionProps('toolbar')}>
        <button type="button" tabIndex={-1}>
          {OTHER_TOOL_BUTTON}
        </button>
        <button type="button">{TOOL_BUTTON}</button>
      </div>
      <div {...focusRegionProps(WORKSPACE_FOCUS_REGION)} />
      <div {...focusRegionProps('status-bar')}>
        <button type="button" disabled>
          {DISABLED_BUTTON}
        </button>
      </div>
    </div>,
  );

  return screen.getByTestId(FRAME_ID);
}

function createEditor(root: HTMLElement): EditorRegistries {
  const editor = createEditorRegistries();
  registerFocusRegionCommands(editor, () => root);

  return editor;
}

function next(editor: EditorRegistries): void {
  editor.commands.execute(focusNextRegionCommand, { source: 'hotkey', target: undefined });
}

function previous(editor: EditorRegistries): void {
  editor.commands.execute(focusPreviousRegionCommand, { source: 'hotkey', target: undefined });
}

function focusedName(): string | null {
  return document.activeElement?.textContent ?? null;
}

function dockWithActiveWindow(): DockAdapter {
  return {
    getWindows: () => [SCENE_WINDOW],
    getActiveWindowId: () => SCENE_WINDOW.id,
    getGroupWindowIds: () => [SCENE_WINDOW.id],
    addWindow: () => undefined,
    activateWindow: () => undefined,
    closeWindow: () => undefined,
    applyLayout: () => undefined,
    maximizeWindow: () => undefined,
    restoreMaximized: () => undefined,
    isMaximized: () => false,
    subscribe: () => () => undefined,
  };
}

describe('focus region commands', () => {
  it('moves the focus to the tab stop of the next area and skips areas without one', () => {
    const editor = createEditor(renderFrame());

    next(editor);
    expect(focusedName()).toBe(MENU_BUTTON);

    next(editor);
    expect(focusedName()).toBe(TOOL_BUTTON);

    next(editor);
    expect(focusedName()).toBe(MENU_BUTTON);
  });

  it('moves the focus backwards in a circle', () => {
    const editor = createEditor(renderFrame());

    previous(editor);
    expect(focusedName()).toBe(TOOL_BUTTON);

    previous(editor);
    expect(focusedName()).toBe(MENU_BUTTON);
  });

  it('asks the workspace to focus the active window', () => {
    const editor = createEditor(renderFrame());
    editor.workspace.attach(dockWithActiveWindow());
    screen.getByRole('button', { name: TOOL_BUTTON }).focus();

    next(editor);

    expect(editor.workspace.takeFocusRequest(SCENE_WINDOW.id)).toBe(true);
  });
});
