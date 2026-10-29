import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HOTKEY_SCOPE_ATTRIBUTE } from '@/core/hotkeys/hotkeyScope';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import { WindowFrame } from './WindowFrame';

const WINDOW_ID = 'test.scene';
const OUTSIDE_LABEL = 'outside';
const INSIDE_LABEL = 'inside';
const EMPTY_AREA_TEXT = 'empty area';
const MENU_LABEL = 'Component menu';
const RESET_LABEL = 'Reset';

afterEach(() => {
  cleanup();
});

function renderFrame(editor: TestEditor, onActivate: () => void = vi.fn()) {
  render(
    <TestEditorProviders editor={editor}>
      <button type="button">{OUTSIDE_LABEL}</button>
      <WindowFrame windowId={WINDOW_ID} windowType="test.scene" onActivate={onActivate}>
        <p>{EMPTY_AREA_TEXT}</p>
        <button type="button">{INSIDE_LABEL}</button>
      </WindowFrame>
    </TestEditorProviders>,
  );

  const frame = screen.getByText(EMPTY_AREA_TEXT).parentElement;

  if (frame === null) {
    throw new Error('Window frame is not rendered');
  }

  return frame;
}

describe('WindowFrame', () => {
  it('marks the window as a hotkey scope of its type', () => {
    const frame = renderFrame(createTestEditor());

    expect(frame.getAttribute(HOTKEY_SCOPE_ATTRIBUTE)).toBe('test.scene');
  });

  it('takes focus on a click into an empty area and activates the window', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    const frame = renderFrame(createTestEditor(), onActivate);

    await user.click(screen.getByText(EMPTY_AREA_TEXT));

    expect(document.activeElement).toBe(frame);
    expect(onActivate).toHaveBeenCalled();
  });

  it('activates the window when focus moves to an element inside', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    renderFrame(createTestEditor(), onActivate);

    await user.click(screen.getByRole('button', { name: INSIDE_LABEL }));

    expect(onActivate).toHaveBeenCalled();
  });

  it('takes focus when the workspace asks for it without activating the window again', () => {
    const editor = createTestEditor();
    const onActivate = vi.fn();
    const frame = renderFrame(editor, onActivate);

    act(() => {
      editor.registries.workspace.requestFocus(WINDOW_ID);
    });

    expect(document.activeElement).toBe(frame);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('keeps focus on an element inside when the workspace asks to focus the window', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    renderFrame(editor);
    const inside = screen.getByRole('button', { name: INSIDE_LABEL });
    await user.click(inside);

    act(() => {
      editor.registries.workspace.requestFocus(WINDOW_ID);
    });

    expect(document.activeElement).toBe(inside);
  });

  it('keeps a menu opened from the window open when the workspace asks to focus the window', async () => {
    const user = userEvent.setup();
    const editor = createTestEditor();
    render(
      <TestEditorProviders editor={editor}>
        <WindowFrame windowId={WINDOW_ID} windowType="test.scene" onActivate={vi.fn()}>
          <Menu
            items={[{ kind: 'action', id: 'reset', label: RESET_LABEL, onSelect: vi.fn() }]}
            trigger={(triggerProps) => (
              <IconButton
                {...triggerProps}
                label={MENU_LABEL}
                icon={frameworkIcons['more-vertical']}
              />
            )}
          />
        </WindowFrame>
      </TestEditorProviders>,
    );

    await user.click(screen.getByRole('button', { name: MENU_LABEL }));
    const item = await screen.findByRole('menuitem', { name: RESET_LABEL });
    await waitFor(() => {
      expect(document.activeElement).toBe(item);
    });

    act(() => {
      editor.registries.workspace.requestFocus(WINDOW_ID);
    });

    expect(document.activeElement).toBe(item);
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeDefined();
    });
    expect(screen.getByRole('menuitem', { name: RESET_LABEL })).toBe(item);
  });
});
