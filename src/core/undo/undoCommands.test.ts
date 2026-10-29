import { describe, expect, it, vi } from 'vitest';
import { createCommandRegistry } from '@/core/commands/commandRegistry';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { redoCommand, registerUndoCommands, undoCommand } from './undoCommands';
import { createUndoStack } from './undoStack';

const MENU = { source: 'menu', target: undefined } as const;

const messages = defineMessages({ en: { change: 'Change' }, ru: { change: 'Изменение' } });

describe('registerUndoCommands', () => {
  it('runs the stack and follows its state', () => {
    const commands = createCommandRegistry();
    const undo = createUndoStack();
    const operation = { label: messageRef(messages, 'change'), undo: vi.fn(), redo: vi.fn() };
    const unsubscribe = registerUndoCommands(commands, undo);

    expect(commands.getState(undoCommand, MENU).enabled).toBe(false);

    const version = commands.getVersion();
    undo.push(operation);

    expect(commands.getVersion()).not.toBe(version);
    expect(commands.getState(undoCommand, MENU).enabled).toBe(true);
    expect(commands.getState(redoCommand, MENU).enabled).toBe(false);

    commands.execute(undoCommand, MENU);

    expect(operation.undo).toHaveBeenCalledOnce();
    expect(commands.getState(redoCommand, MENU).enabled).toBe(true);

    commands.execute(redoCommand, { source: 'hotkey', target: undefined });

    expect(operation.redo).toHaveBeenCalledOnce();

    unsubscribe();

    expect(commands.getState(undoCommand, MENU).handled).toBe(false);
  });

  it('works in a committed value field but not over uncommitted typing', () => {
    expect(undoCommand.shortcut?.allowInTextInput).toBe('whenCommitted');
    expect(redoCommand.shortcut?.allowInTextInput).toBe('whenCommitted');
  });
});
