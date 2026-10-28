import { describe, expectTypeOf, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { CommandShortcut } from '@/core/hotkeys/shortcut';
import { defineCommand } from './command';
import type { CommandDefinition, CommandDefinitionInput } from './command';

const messages = defineMessages({
  en: { save: 'Save', rename: 'Rename' },
  ru: { save: 'Сохранить', rename: 'Переименовать' },
});

interface SceneObject {
  readonly name: string;
}

const saveScene = defineCommand({
  id: 'scene.save',
  label: messageRef(messages, 'save'),
  shortcut: { keys: 'Mod+KeyS' },
});

const renameObject = defineCommand<SceneObject>({
  id: 'object.rename',
  label: messageRef(messages, 'rename'),
});

describe('command types', () => {
  it('defaults to a command without a target', () => {
    expectTypeOf(saveScene).toEqualTypeOf<CommandDefinition>();
    expectTypeOf(renameObject).toEqualTypeOf<CommandDefinition<SceneObject>>();
  });

  it('does not mix commands with different targets', () => {
    expectTypeOf(renameObject).not.toExtend<CommandDefinition>();
    expectTypeOf(saveScene).not.toExtend<CommandDefinition<SceneObject>>();
  });

  it('allows a shortcut only for commands without a target', () => {
    expectTypeOf<{ shortcut: CommandShortcut }>().toExtend<
      Pick<CommandDefinitionInput<undefined>, 'shortcut'>
    >();
    expectTypeOf<{ shortcut: CommandShortcut }>().not.toExtend<
      Pick<CommandDefinitionInput<SceneObject>, 'shortcut'>
    >();
  });

  it('accepts only known keys in the canonical modifier order', () => {
    expectTypeOf<{ keys: 'Mod+Shift+KeyS' }>().toExtend<CommandShortcut>();
    expectTypeOf<{ keys: 'Shift+Mod+KeyS' }>().not.toExtend<CommandShortcut>();
    expectTypeOf<{ keys: 'Mod+S' }>().not.toExtend<CommandShortcut>();
  });
});
