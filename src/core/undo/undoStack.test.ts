import { describe, expect, it, vi } from 'vitest';
import type { UndoOperation } from '@/contracts/undo';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createUndoStack } from './undoStack';

const messages = defineMessages({
  en: { change: 'Change', group: 'Group' },
  ru: { change: 'Изменение', group: 'Группа' },
});
const CHANGE = messageRef(messages, 'change');
const GROUP = messageRef(messages, 'group');

function counterOperation(log: string[], name: string): UndoOperation {
  return {
    label: CHANGE,
    undo: () => {
      log.push(`undo ${name}`);
    },
    redo: () => {
      log.push(`redo ${name}`);
    },
  };
}

describe('createUndoStack', () => {
  it('starts empty', () => {
    const stack = createUndoStack();

    expect(stack.canUndo()).toBe(false);
    expect(stack.canRedo()).toBe(false);
    expect(stack.undo()).toBe(false);
    expect(stack.redo()).toBe(false);
  });

  it('undoes and redoes in order', () => {
    const log: string[] = [];
    const stack = createUndoStack();
    stack.push(counterOperation(log, 'a'));
    stack.push(counterOperation(log, 'b'));

    stack.undo();
    stack.undo();
    stack.redo();

    expect(log).toEqual(['undo b', 'undo a', 'redo a']);
    expect(stack.canUndo()).toBe(true);
    expect(stack.canRedo()).toBe(true);
  });

  it('drops the redo branch on a new operation', () => {
    const log: string[] = [];
    const stack = createUndoStack();
    stack.push(counterOperation(log, 'a'));
    stack.undo();
    stack.push(counterOperation(log, 'b'));

    expect(stack.canRedo()).toBe(false);
    expect(stack.peekUndo()?.label).toBe(CHANGE);
  });

  it('keeps only the latest operations up to the limit', () => {
    const log: string[] = [];
    const stack = createUndoStack({ limit: 2 });
    stack.push(counterOperation(log, 'a'));
    stack.push(counterOperation(log, 'b'));
    stack.push(counterOperation(log, 'c'));

    while (stack.undo()) {
      continue;
    }

    expect(log).toEqual(['undo c', 'undo b']);
  });

  it('records a group as one operation and undoes it in reverse', () => {
    const log: string[] = [];
    const stack = createUndoStack();

    stack.group(GROUP, () => {
      stack.push(counterOperation(log, 'a'));
      stack.group(CHANGE, () => {
        stack.push(counterOperation(log, 'b'));
      });
    });
    stack.undo();
    stack.redo();

    expect(log).toEqual(['undo b', 'undo a', 'redo a', 'redo b']);
    expect(stack.peekUndo()?.label).toBe(GROUP);
    expect(stack.canUndo()).toBe(true);

    stack.undo();

    expect(stack.canUndo()).toBe(false);
  });

  it('records nothing for an empty group', () => {
    const stack = createUndoStack();

    stack.group(GROUP, () => undefined);

    expect(stack.canUndo()).toBe(false);
  });

  it('closes a group when its function throws', () => {
    const log: string[] = [];
    const stack = createUndoStack();

    expect(() => {
      stack.group(GROUP, () => {
        throw new Error('failed');
      });
    }).toThrow('failed');
    stack.push(counterOperation(log, 'a'));
    stack.undo();

    expect(log).toEqual(['undo a']);
  });

  it('ignores operations pushed while undoing', () => {
    const stack = createUndoStack();
    stack.push({
      label: CHANGE,
      undo: () => {
        stack.push({ label: CHANGE, undo: vi.fn(), redo: vi.fn() });
      },
      redo: vi.fn(),
    });

    stack.undo();

    expect(stack.canUndo()).toBe(false);
    expect(stack.canRedo()).toBe(true);
  });

  it('notifies listeners and clears', () => {
    const stack = createUndoStack();
    const listener = vi.fn();
    const unsubscribe = stack.subscribe(listener);

    stack.push(counterOperation([], 'a'));
    stack.undo();
    stack.clear();
    unsubscribe();
    stack.push(counterOperation([], 'b'));

    expect(listener).toHaveBeenCalledTimes(3);
    expect(stack.canRedo()).toBe(false);
  });
});
