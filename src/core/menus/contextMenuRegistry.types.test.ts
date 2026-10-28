import { describe, expectTypeOf, it } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { ContextMenuItemRegistration } from './contextMenuRegistry';

const messages = defineMessages({
  en: { rename: 'Rename', paste: 'Paste' },
  ru: { rename: 'Переименовать', paste: 'Вставить' },
});

interface SceneObject {
  readonly name: string;
}

const renameObject = defineCommand<SceneObject>({
  id: 'object.rename',
  label: messageRef(messages, 'rename'),
});
const renameTab = defineCommand<string>({
  id: 'tab.rename',
  label: messageRef(messages, 'rename'),
});
const paste = defineCommand({ id: 'edit.paste', label: messageRef(messages, 'paste') });

const PLACEMENT = { path: 'item', group: 0, order: 0 } as const;

describe('context menu item types', () => {
  it('accepts a command of the context target type', () => {
    expectTypeOf({ ...PLACEMENT, command: renameObject }).toExtend<
      ContextMenuItemRegistration<SceneObject>
    >();
  });

  it('rejects a command of another target type', () => {
    expectTypeOf({ ...PLACEMENT, command: renameTab }).not.toExtend<
      ContextMenuItemRegistration<SceneObject>
    >();
  });

  it('accepts a command without a target only when marked as such', () => {
    expectTypeOf({ ...PLACEMENT, command: paste, withoutTarget: true as const }).toExtend<
      ContextMenuItemRegistration<SceneObject>
    >();
    expectTypeOf({ ...PLACEMENT, command: paste }).not.toExtend<
      ContextMenuItemRegistration<SceneObject>
    >();
    expectTypeOf({
      ...PLACEMENT,
      command: renameObject,
      withoutTarget: true as const,
    }).not.toExtend<ContextMenuItemRegistration<SceneObject>>();
  });
});
