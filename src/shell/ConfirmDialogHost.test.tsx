import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { ConfirmAnswer, ConfirmOptions } from '@/state/dialogs/confirmDialogStore';
import { ConfirmDialogHost } from './ConfirmDialogHost';
import { ContextMenu } from './ContextMenu';
import { MenuBar } from './MenuBar';
import { createTestEditor } from './testEditor';
import type { TestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';
import { useContextMenu } from './useContextMenu';

const messages = defineMessages({
  en: {
    deleteTitle: 'Delete {name}?',
    deleteMessage: 'You cannot undo this.',
    delete: 'Delete',
    keep: 'Keep',
    saveTitle: 'Save the scene?',
    save: 'Save',
    edit: 'Edit',
    object: 'Object',
  },
  ru: {
    deleteTitle: 'Удалить {name}?',
    deleteMessage: 'Это нельзя отменить.',
    delete: 'Удалить',
    keep: 'Оставить',
    saveTitle: 'Сохранить сцену?',
    save: 'Сохранить',
    edit: 'Правка',
    object: 'Объект',
  },
});

const DELETE_CUBE: ConfirmOptions = {
  title: messageRef(messages, 'deleteTitle', { name: 'Cube' }),
  message: messageRef(messages, 'deleteMessage'),
  confirmLabel: messageRef(messages, 'delete'),
  cancelLabel: messageRef(messages, 'keep'),
  destructive: true,
};
const SAVE: ConfirmOptions = {
  title: messageRef(messages, 'saveTitle'),
  confirmLabel: messageRef(messages, 'save'),
};

const OUTSIDE = 'Outside';
const SETTLE_MS = 50;

function setUp(): TestEditor {
  const editor = createTestEditor();
  render(
    <TestEditorProviders editor={editor}>
      <button type="button">{OUTSIDE}</button>
      <ConfirmDialogHost />
    </TestEditorProviders>,
  );

  return editor;
}

function ask(editor: TestEditor, options: ConfirmOptions): Promise<ConfirmAnswer> {
  let answer: Promise<ConfirmAnswer> = Promise.resolve('cancel');
  act(() => {
    answer = editor.registries.dialogs.confirm(options);
  });

  return answer;
}

function settle(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, SETTLE_MS);
  });
}

async function expectFocusInDialog(name: string): Promise<void> {
  await waitFor(() => {
    expect(document.activeElement).toBe(screen.getByRole('button', { name }));
  });
  await act(settle);
  expect(document.activeElement).toBe(screen.getByRole('button', { name }));
}

afterEach(() => {
  cleanup();
});

describe('ConfirmDialogHost', () => {
  it('shows the texts of the request and answers confirm', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const answer = ask(editor, SAVE);

    expect(screen.getByRole('dialog', { name: 'Save the scene?' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await expect(answer).resolves.toBe('confirm');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('focuses the confirm action of an ordinary request', async () => {
    const editor = setUp();
    void ask(editor, SAVE);

    await expectFocusInDialog('Save');
  });

  it('focuses the safe action of a destructive request and answers cancel on Enter', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const answer = ask(editor, DELETE_CUBE);

    expect(screen.getByRole('dialog', { name: 'Delete Cube?' })).toBeDefined();
    expect(screen.getByText('You cannot undo this.')).toBeDefined();
    await expectFocusInDialog('Keep');

    await user.keyboard('{Enter}');

    await expect(answer).resolves.toBe('cancel');
  });

  it('answers cancel on Escape', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const answer = ask(editor, SAVE);
    await expectFocusInDialog('Save');

    await user.keyboard('{Escape}');

    await expect(answer).resolves.toBe('cancel');
  });

  it('shows the second request after the first one is answered', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const first = ask(editor, SAVE);
    const second = ask(editor, DELETE_CUBE);

    expect(screen.getAllByRole('dialog')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await expect(first).resolves.toBe('confirm');
    expect(screen.getByRole('dialog', { name: 'Delete Cube?' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await expect(second).resolves.toBe('confirm');
  });

  it('returns the focus to where it was after the answer', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    screen.getByRole('button', { name: OUTSIDE }).focus();
    void ask(editor, SAVE);
    await expectFocusInDialog('Save');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: OUTSIDE }));
    });
  });

  it('translates the dialog', () => {
    const editor = setUp();
    act(() => {
      editor.stores.language.getState().setLanguage('ru');
    });
    void ask(editor, DELETE_CUBE);

    expect(screen.getByRole('dialog', { name: 'Удалить Cube?' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Оставить' })).toBeDefined();
  });
});

interface SceneObject {
  readonly name: string;
}

const deleteObject = defineCommand<SceneObject>({
  id: 'object.delete',
  label: messageRef(messages, 'delete'),
});
const saveScene = defineCommand({ id: 'scene.save', label: messageRef(messages, 'save') });
const objectMenu = defineContextMenu<SceneObject>({
  id: 'hierarchy.item',
  label: messageRef(messages, 'object'),
});
const CUBE: SceneObject = { name: 'Cube' };

function ObjectRow() {
  const menu = useContextMenu(objectMenu);

  return (
    <>
      <button type="button" {...menu.getTriggerProps(CUBE)}>
        {CUBE.name}
      </button>
      <ContextMenu context={objectMenu} request={menu.request} onClose={menu.close} />
    </>
  );
}

function setUpMenus(): { editor: TestEditor; answers: ConfirmAnswer[] } {
  const editor = createTestEditor();
  const answers: ConfirmAnswer[] = [];
  const { mainMenu, contextMenus, commands, dialogs } = editor.registries;
  mainMenu.registerMenu({ path: 'edit', label: messageRef(messages, 'edit'), group: 0, order: 0 });
  mainMenu.registerItem({ path: 'edit/save', command: saveScene, group: 0, order: 0 });
  contextMenus.registerItem(objectMenu, {
    path: 'delete',
    command: deleteObject,
    group: 0,
    order: 0,
  });
  commands.handle(saveScene, {
    run: async () => {
      answers.push(await dialogs.confirm(SAVE));
    },
  });
  commands.handle(deleteObject, {
    run: async ({ target }) => {
      answers.push(
        await dialogs.confirm({
          ...DELETE_CUBE,
          title: messageRef(messages, 'deleteTitle', { name: target.name }),
        }),
      );
    },
  });
  render(
    <TestEditorProviders editor={editor}>
      <MenuBar />
      <ObjectRow />
      <ConfirmDialogHost />
    </TestEditorProviders>,
  );

  return { editor, answers };
}

describe('ConfirmDialog opened by a menu command', () => {
  it('keeps the focus in the dialog after a main menu item', async () => {
    const user = userEvent.setup();
    const { answers } = setUpMenus();

    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Save' }));

    await screen.findByRole('dialog', { name: 'Save the scene?' });
    await expectFocusInDialog('Save');
    expect(screen.queryByRole('menu')).toBeNull();

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(answers).toEqual(['confirm']);
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Edit' }));
    });
  });

  it('keeps the focus in the dialog after a main menu item chosen with the keyboard', async () => {
    const user = userEvent.setup();
    setUpMenus();
    screen.getByRole('menuitem', { name: 'Edit' }).focus();

    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Save' }));
    });
    await user.keyboard('{Enter}');

    await screen.findByRole('dialog', { name: 'Save the scene?' });
    await expectFocusInDialog('Save');
  });

  it('keeps the focus in the dialog after a context menu item', async () => {
    const user = userEvent.setup();
    const { answers } = setUpMenus();
    const row = screen.getByRole('button', { name: CUBE.name });
    row.focus();

    fireEvent.keyDown(row, { key: 'ContextMenu' });
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
    });
    await user.keyboard('{Enter}');

    await screen.findByRole('dialog', { name: 'Delete Cube?' });
    await expectFocusInDialog('Keep');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(answers).toEqual(['cancel']);
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(row);
    });
  });
});
