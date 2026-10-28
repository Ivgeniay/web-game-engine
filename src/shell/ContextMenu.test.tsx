import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { ContextMenuContext } from '@/core/menus/contextMenuRegistry';
import { ContextMenu } from './ContextMenu';
import { createTestEditor } from './testEditor';
import type { TestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';
import { useContextMenu } from './useContextMenu';

const messages = defineMessages({
  en: { object: 'Object', area: 'Area', rename: 'Rename', paste: 'Paste', create: 'Create' },
  ru: {
    object: 'Объект',
    area: 'Область',
    rename: 'Переименовать',
    paste: 'Вставить',
    create: 'Создать',
  },
});

interface SceneObject {
  readonly name: string;
}

const objectMenu = defineContextMenu<SceneObject>({
  id: 'hierarchy.item',
  label: messageRef(messages, 'object'),
});
const areaMenu = defineContextMenu<undefined>({
  id: 'hierarchy.area',
  label: messageRef(messages, 'area'),
});
const renameObject = defineCommand<SceneObject>({
  id: 'object.rename',
  label: messageRef(messages, 'rename'),
});
const paste = defineCommand({ id: 'edit.paste', label: messageRef(messages, 'paste') });

const CUBE: SceneObject = { name: 'Cube' };
const FIELD = 'Name';

interface TriggerProps<TTarget> {
  readonly context: ContextMenuContext<TTarget>;
  readonly target: TTarget;
  readonly name: string;
}

function Row({ context, target, name }: TriggerProps<SceneObject>) {
  const menu = useContextMenu(context);

  return (
    <>
      <button type="button" {...menu.getTriggerProps(target)}>
        {name}
      </button>
      <ContextMenu context={context} request={menu.request} onClose={menu.close} />
    </>
  );
}

function Area() {
  const areaContextMenu = useContextMenu(areaMenu);

  return (
    <div data-testid="area" {...areaContextMenu.getTriggerProps(undefined)}>
      <Row context={objectMenu} target={CUBE} name={CUBE.name} />
      <input aria-label={FIELD} />
      <ContextMenu
        context={areaMenu}
        request={areaContextMenu.request}
        onClose={areaContextMenu.close}
      />
    </div>
  );
}

function setUp(): TestEditor {
  const editor = createTestEditor();
  const { contextMenus } = editor.registries;
  contextMenus.registerItem(objectMenu, {
    path: 'rename',
    command: renameObject,
    group: 0,
    order: 0,
  });
  contextMenus.registerItem(objectMenu, {
    path: 'paste',
    command: paste,
    withoutTarget: true,
    group: 1,
    order: 0,
  });
  contextMenus.registerItem(areaMenu, { path: 'paste', command: paste, group: 0, order: 0 });

  render(
    <TestEditorProviders editor={editor}>
      <Area />
    </TestEditorProviders>,
  );

  return editor;
}

function row(): HTMLElement {
  return screen.getByRole('button', { name: CUBE.name });
}

function menuLabels(): string[] {
  return screen.getAllByRole('menuitem').map((item) => item.textContent);
}

afterEach(() => {
  cleanup();
});

describe('useContextMenu and ContextMenu', () => {
  it('opens the menu of the clicked element at the pointer', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
      editor.registries.commands.handle(paste, { run: vi.fn() });
    });

    const notPrevented = fireEvent.contextMenu(row(), { button: 2, clientX: 10, clientY: 20 });

    expect(notPrevented).toBe(false);
    expect(screen.getByRole('menu', { name: 'Object' })).toBeDefined();
    expect(menuLabels()).toEqual(['Rename', 'Paste']);
  });

  it('passes the target only to commands of the target type', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    const rename = vi.fn();
    const pasteRun = vi.fn();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: rename });
      editor.registries.commands.handle(paste, { run: pasteRun });
    });

    fireEvent.contextMenu(row(), { button: 2 });
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }));
    fireEvent.contextMenu(row(), { button: 2 });
    await user.click(screen.getByRole('menuitem', { name: 'Paste' }));

    await waitFor(() => {
      expect(pasteRun).toHaveBeenCalledWith({ source: 'context-menu', target: undefined });
    });
    expect(rename).toHaveBeenCalledWith({ source: 'context-menu', target: CUBE });
  });

  it.each([
    ['the context menu key', { key: 'ContextMenu' }],
    ['Shift+F10', { key: 'F10', shiftKey: true }],
  ])('opens from the keyboard with %s', async (_case, keys) => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
    });
    row().focus();

    fireEvent.keyDown(row(), keys);

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Rename' }));
    });
  });

  it('ignores events that come from an open menu through the portal', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
      editor.registries.commands.handle(paste, { run: vi.fn() });
    });
    fireEvent.contextMenu(row(), { button: 2 });

    fireEvent.contextMenu(screen.getByRole('menuitem', { name: 'Rename' }), { button: 2 });
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Rename' }), { key: 'ContextMenu' });

    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(screen.getByRole('menu', { name: 'Object' })).toBeDefined();
  });

  it('returns the focus to the element after Escape', async () => {
    const user = userEvent.setup();
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
    });
    row().focus();
    fireEvent.keyDown(row(), { key: 'ContextMenu' });
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Rename' }));
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.activeElement).toBe(row());
    });
  });

  it('gives the inner element priority over the surrounding area', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
      editor.registries.commands.handle(paste, { run: vi.fn() });
    });

    fireEvent.contextMenu(row(), { button: 2 });

    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(screen.getByRole('menu', { name: 'Object' })).toBeDefined();

    fireEvent.contextMenu(screen.getByTestId('area'), { button: 2 });

    expect(screen.getByRole('menu', { name: 'Area' })).toBeDefined();
  });

  it('opens nothing when no command of the context has a handler', () => {
    setUp();

    expect(fireEvent.contextMenu(row(), { button: 2 })).toBe(false);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('keeps the native menu of a text field', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(paste, { run: vi.fn() });
    });

    expect(fireEvent.contextMenu(screen.getByRole('textbox', { name: FIELD }), { button: 2 })).toBe(
      true,
    );
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('translates the menu', () => {
    const editor = setUp();
    act(() => {
      editor.registries.commands.handle(renameObject, { run: vi.fn() });
      editor.stores.language.getState().setLanguage('ru');
    });

    fireEvent.contextMenu(row(), { button: 2 });

    expect(screen.getByRole('menu', { name: 'Объект' })).toBeDefined();
    expect(menuLabels()).toEqual(['Переименовать']);
  });

  it('shows items registered by anyone for the context', () => {
    const editor = setUp();
    const create = defineCommand<SceneObject>({
      id: 'integration.create',
      label: messageRef(messages, 'create'),
    });
    act(() => {
      editor.registries.commands.handle(create, { run: vi.fn() });
      editor.registries.contextMenus.registerItem(objectMenu, {
        path: 'create',
        command: create,
        group: 0,
        order: 10,
      });
    });

    fireEvent.contextMenu(row(), { button: 2 });

    expect(menuLabels()).toEqual(['Create']);
  });
});
