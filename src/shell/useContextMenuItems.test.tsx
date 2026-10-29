import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { MenuItem } from '@/contracts/menu';
import { createTestEditor } from './testEditor';
import { TestEditorProviders } from './TestEditorProviders';
import { useContextMenuItems } from './useContextMenuItems';

const messages = defineMessages({
  en: { component: 'Component', reset: 'Reset', remove: 'Remove', copy: 'Copy' },
  ru: { component: 'Компонент', reset: 'Сбросить', remove: 'Удалить', copy: 'Копировать' },
});

interface ComponentTarget {
  readonly component: string;
}

interface WrapperProps {
  readonly children: ReactNode;
}

const componentMenu = defineContextMenu<ComponentTarget>({
  id: 'inspector.component',
  label: messageRef(messages, 'component'),
});
const resetComponent = defineCommand<ComponentTarget>({
  id: 'component.reset',
  label: messageRef(messages, 'reset'),
});
const removeComponent = defineCommand<ComponentTarget>({
  id: 'component.remove',
  label: messageRef(messages, 'remove'),
});
const copyComponent = defineCommand<ComponentTarget>({
  id: 'component.copy',
  label: messageRef(messages, 'copy'),
});

const LIGHT: ComponentTarget = { component: 'light' };
const TRANSFORM: ComponentTarget = { component: 'transform' };

function setup(target: ComponentTarget) {
  const editor = createTestEditor();
  const { commands, contextMenus } = editor.registries;
  const reset = vi.fn();
  commands.handle(resetComponent, { run: reset });
  commands.handle(removeComponent, {
    run: vi.fn(),
    isEnabled: (invocation) => invocation.target.component !== 'transform',
  });
  contextMenus.registerItem(componentMenu, {
    path: 'reset',
    command: resetComponent,
    group: 0,
    order: 0,
  });
  contextMenus.registerItem(componentMenu, {
    path: 'remove',
    command: removeComponent,
    group: 10,
    order: 0,
  });
  contextMenus.registerItem(componentMenu, {
    path: 'copy',
    command: copyComponent,
    group: 10,
    order: 10,
  });

  function Wrapper({ children }: WrapperProps) {
    return <TestEditorProviders editor={editor}>{children}</TestEditorProviders>;
  }

  const { result } = renderHook(() => useContextMenuItems(componentMenu, target), {
    wrapper: Wrapper,
  });

  return { editor, reset, items: () => result.current };
}

afterEach(() => {
  vi.useRealTimers();
});

function itemByLabel(items: readonly MenuItem[], label: string): MenuItem | undefined {
  return items.find((item) => 'label' in item && item.label === label);
}

describe('useContextMenuItems', () => {
  it('builds the visible items of the context with separators between groups', () => {
    const { items } = setup(LIGHT);

    expect(items().map((item) => item.kind)).toEqual(['action', 'separator', 'action']);
    expect(itemByLabel(items(), 'Reset')).toBeDefined();
    expect(itemByLabel(items(), 'Copy')).toBeUndefined();
  });

  it('asks the handlers about the target', () => {
    const { items } = setup(TRANSFORM);

    expect(itemByLabel(items(), 'Remove')).toMatchObject({ disabled: true });
  });

  it('runs the command with the target after the menu closes', () => {
    vi.useFakeTimers();
    const { reset, items } = setup(LIGHT);
    const item = itemByLabel(items(), 'Reset');

    if (item?.kind !== 'action') {
      throw new Error('Reset is not an action');
    }

    item.onSelect();

    expect(reset).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(reset).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'context-menu', target: LIGHT }),
    );
  });

  it('follows the registrations', () => {
    const { editor, items } = setup(LIGHT);

    act(() => {
      editor.registries.commands.handle(copyComponent, { run: vi.fn() });
    });

    expect(itemByLabel(items(), 'Copy')).toBeDefined();
  });
});
