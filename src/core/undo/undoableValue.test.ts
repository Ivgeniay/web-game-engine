import { describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createUndoableValue, sameValue } from './undoableValue';
import { createUndoStack } from './undoStack';

const messages = defineMessages({ en: { mass: 'Mass' }, ru: { mass: 'Масса' } });

function setup<T>(initial: T) {
  let value = initial;
  const undo = createUndoStack();
  const handler = createUndoableValue<T>(() => ({
    undo,
    label: messageRef(messages, 'mass'),
    read: () => value,
    write: (next) => {
      value = next;
    },
  }));

  return { undo, handler, current: () => value };
}

describe('sameValue', () => {
  it('compares numbers and arrays of numbers', () => {
    expect(sameValue(1, 1)).toBe(true);
    expect(sameValue(Number.NaN, Number.NaN)).toBe(true);
    expect(sameValue([1, 2], [1, 2])).toBe(true);
    expect(sameValue([1, 2], [1, 3])).toBe(false);
    expect(sameValue([1], [1, 2])).toBe(false);
  });
});

describe('createUndoableValue', () => {
  it('records one entry for a series of previews and a commit', () => {
    const { undo, handler, current } = setup(1);

    handler(2, 'preview');
    handler(3, 'preview');
    handler(3, 'commit');

    expect(current()).toBe(3);

    undo.undo();

    expect(current()).toBe(1);
    expect(undo.canUndo()).toBe(false);

    undo.redo();

    expect(current()).toBe(3);
  });

  it('records a commit without previews', () => {
    const { undo, handler, current } = setup('Cube');

    handler('Sphere', 'commit');
    undo.undo();

    expect(current()).toBe('Cube');
  });

  it('records nothing when the value came back unchanged', () => {
    const { undo, handler } = setup([1, 2, 3]);

    handler([1, 5, 3], 'preview');
    handler([1, 2, 3], 'commit');

    expect(undo.canUndo()).toBe(false);
  });

  it('restores the start value on cancel and records nothing', () => {
    const { undo, handler, current } = setup(1);

    handler(4, 'preview');
    handler(1, 'cancel');

    expect(current()).toBe(1);
    expect(undo.canUndo()).toBe(false);
  });

  it('starts a new change after a commit', () => {
    const { undo, handler, current } = setup(1);

    handler(2, 'preview');
    handler(2, 'commit');
    handler(5, 'preview');
    handler(5, 'commit');
    undo.undo();

    expect(current()).toBe(2);
  });
});
