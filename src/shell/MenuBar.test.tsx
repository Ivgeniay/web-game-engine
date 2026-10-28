import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { Platform } from '@/core/hotkeys/platform';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { MenuBar } from './MenuBar';
import { createTestEditor } from './testEditor';
import type { TestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';

const messages = defineMessages({
  en: {
    file: 'File',
    edit: 'Edit',
    help: 'Help',
    save: 'Save',
    undo: 'Undo',
    about: 'About',
  },
  ru: {
    file: 'Файл',
    edit: 'Правка',
    help: 'Справка',
    save: 'Сохранить',
    undo: 'Отменить',
    about: 'О программе',
  },
});

const save = defineCommand({
  id: 'file.save',
  label: messageRef(messages, 'save'),
  shortcut: { keys: 'Mod+KeyS' },
});
const undo = defineCommand({ id: 'edit.undo', label: messageRef(messages, 'undo') });
const about = defineCommand({ id: 'help.about', label: messageRef(messages, 'about') });

const OUTSIDE = 'Outside';

function setUp(platform: Platform = 'other', altKeyActivates?: boolean): TestEditor {
  const editor = createTestEditor(platform);
  const { mainMenu } = editor.registries;
  mainMenu.registerMenu({ path: 'help', label: messageRef(messages, 'help'), group: 9, order: 0 });
  mainMenu.registerMenu({ path: 'edit', label: messageRef(messages, 'edit'), group: 0, order: 20 });
  mainMenu.registerMenu({ path: 'file', label: messageRef(messages, 'file'), group: 0, order: 10 });
  mainMenu.registerItem({ path: 'file/save', command: save, group: 0, order: 0 });
  mainMenu.registerItem({ path: 'edit/undo', command: undo, group: 0, order: 0 });
  mainMenu.registerItem({ path: 'help/about', command: about, group: 0, order: 0 });

  render(
    <TestEditorProviders editor={editor}>
      <button type="button">{OUTSIDE}</button>
      <MenuBar {...(altKeyActivates === undefined ? {} : { altKeyActivates })} />
    </TestEditorProviders>,
  );

  return editor;
}

function handleAll(editor: TestEditor): void {
  for (const command of [save, undo, about]) {
    editor.registries.commands.handle(command, { run: vi.fn() });
  }
}

function trigger(name: string): HTMLElement {
  return screen.getByRole('menuitem', { name });
}

async function waitForFocusOn(name: string): Promise<void> {
  await waitFor(() => {
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name }));
  });
}

function topMenuNames(): string[] {
  return screen
    .getAllByRole('menuitem')
    .filter((element) => element.closest('[role="menubar"]') !== null)
    .map((element) => element.textContent);
}

afterEach(() => {
  cleanup();
});

describe('MenuBar', () => {
  it('shows top menus ordered by group and order', () => {
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });

    expect(topMenuNames()).toEqual(['File', 'Edit', 'Help']);
  });

  it('hides menus without handled commands', () => {
    const editor = setUp();

    expect(screen.queryByRole('menuitem')).toBeNull();

    act(() => {
      editor.registries.commands.handle(undo, { run: vi.fn() });
    });

    expect(topMenuNames()).toEqual(['Edit']);
  });

  it('changes labels with the language', () => {
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });

    act(() => {
      editor.stores.language.getState().setLanguage('ru');
    });

    expect(topMenuNames()).toEqual(['Файл', 'Правка', 'Справка']);
  });

  it('opens a menu with its items, shortcuts and availability', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    let canSave = false;
    act(() => {
      editor.registries.commands.handle(save, { run: vi.fn(), isEnabled: () => canSave });
    });

    await user.click(trigger('File'));

    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveProperty('disabled', true);
    expect(screen.getByText('Ctrl+S')).toBeDefined();

    await user.keyboard('{Escape}');
    canSave = true;
    await user.click(trigger('File'));

    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveProperty('disabled', false);
  });

  it('runs the command after the menu has closed', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const menuOpenWhenRun = vi.fn();
    act(() => {
      editor.registries.commands.handle(save, {
        run: () => {
          menuOpenWhenRun(screen.queryByRole('menu') !== null);
        },
      });
    });

    await user.click(trigger('File'));
    await user.click(screen.getByRole('menuitem', { name: 'Save' }));

    await waitFor(() => {
      expect(menuOpenWhenRun).toHaveBeenCalledWith(false);
    });
  });

  it('moves between menus with the arrow keys while a menu is open', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });

    await user.click(trigger('File'));
    await waitForFocusOn('Save');
    await user.keyboard('{ArrowRight}');

    await waitForFocusOn('Undo');
    expect(screen.queryByRole('menuitem', { name: 'Save' })).toBeNull();

    await user.keyboard('{ArrowLeft}');
    await waitForFocusOn('Save');
    await user.keyboard('{ArrowLeft}');

    await waitForFocusOn('About');
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('opens the hovered menu while another one is open', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });

    await user.hover(trigger('Edit'));

    expect(screen.queryByRole('menu')).toBeNull();

    await user.click(trigger('File'));
    await user.hover(trigger('Help'));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'About' })).toBeDefined();
    });
    expect(screen.queryByRole('menuitem', { name: 'Save' })).toBeNull();
  });

  it('closes the open menu on a click on its title, like native menu bars', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });

    await user.click(trigger('File'));
    await waitForFocusOn('Save');
    await user.hover(trigger('Edit'));
    await waitForFocusOn('Undo');
    await user.click(trigger('Edit'));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });

  it('moves the focus between closed menus with the arrow keys and opens with ArrowDown', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });
    trigger('File').focus();

    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(trigger('Edit'));

    await user.keyboard('{ArrowDown}');

    await waitForFocusOn('Undo');
  });

  it('enters the menu bar with F10 and returns with Escape', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });
    screen.getByRole('button', { name: OUTSIDE }).focus();

    await user.keyboard('{F10}');

    expect(document.activeElement).toBe(trigger('File'));

    await user.keyboard('{Escape}');

    expect(document.activeElement).toBe(screen.getByRole('button', { name: OUTSIDE }));
  });

  it('leaves the menu bar with F10', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });
    screen.getByRole('button', { name: OUTSIDE }).focus();

    await user.keyboard('{F10}{F10}');

    expect(document.activeElement).toBe(screen.getByRole('button', { name: OUTSIDE }));
  });

  it('enters the menu bar with a tap of Alt outside macOS', async () => {
    const user = userEvent.setup();
    const editor = setUp('other');
    act(() => {
      handleAll(editor);
    });
    screen.getByRole('button', { name: OUTSIDE }).focus();

    await user.keyboard('{Alt}');

    expect(document.activeElement).toBe(trigger('File'));
  });

  it.each([
    ['on macOS', 'mac', undefined],
    ['when switched off', 'other', false],
  ] as const)('ignores Alt %s', async (_case, platform, altKeyActivates) => {
    const user = userEvent.setup();
    const editor = setUp(platform, altKeyActivates);
    act(() => {
      handleAll(editor);
    });
    const outside = screen.getByRole('button', { name: OUTSIDE });
    outside.focus();

    await user.keyboard('{Alt}');

    expect(document.activeElement).toBe(outside);
  });

  it('ignores Alt pressed together with another key', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });
    const outside = screen.getByRole('button', { name: OUTSIDE });
    outside.focus();

    await user.keyboard('{Alt>}x{/Alt}');

    expect(document.activeElement).toBe(outside);
  });

  it('ignores F10 while a dialog is open', () => {
    const editor = setUp();
    act(() => {
      handleAll(editor);
    });
    render(<div aria-modal="true" />);
    const outside = screen.getByRole('button', { name: OUTSIDE });
    outside.focus();

    fireEvent.keyDown(outside, { key: 'F10', code: 'F10' });

    expect(document.activeElement).toBe(outside);
  });
});
