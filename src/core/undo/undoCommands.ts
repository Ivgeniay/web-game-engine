import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { defineCommand } from '@/core/commands/command';
import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { UndoStack } from './undoStack';

export const undoCommand = defineCommand({
  id: 'edit.undo',
  label: messageRef(commonMessages, 'undo'),
  shortcut: { keys: 'Mod+KeyZ', allowInTextInput: 'whenCommitted' },
});

export const redoCommand = defineCommand({
  id: 'edit.redo',
  label: messageRef(commonMessages, 'redo'),
  shortcut: { keys: 'Mod+Shift+KeyZ', allowInTextInput: 'whenCommitted' },
});

export function registerUndoCommands(commands: CommandRegistry, undo: UndoStack): Unsubscribe {
  return combineUnsubscribes(
    commands.handle(undoCommand, {
      run: () => {
        undo.undo();
      },
      isEnabled: () => undo.canUndo(),
    }),
    commands.handle(redoCommand, {
      run: () => {
        undo.redo();
      },
      isEnabled: () => undo.canRedo(),
    }),
    undo.subscribe(commands.refresh),
  );
}
