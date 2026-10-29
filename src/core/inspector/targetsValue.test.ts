import { describe, expect, it } from 'vitest';
import type { PropertyAccess, TargetsChange } from '@/contracts/property';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createUndoStack } from '@/core/undo/undoStack';
import { samePropertyValue } from './propertyValue';
import { createTargetsChangeHandler, readTargetsValue } from './targetsValue';

const messages = defineMessages({ en: { position: 'Position' }, ru: { position: 'Позиция' } });

type Vector = readonly number[];

function createObjects(initial: Readonly<Record<string, Vector>>) {
  const values = new Map(Object.entries(initial));
  const access: PropertyAccess<Vector> = {
    read: (targetId) => values.get(targetId) ?? [],
    write: (targetId, value) => {
      values.set(targetId, value);
    },
  };

  return { access, snapshot: () => Object.fromEntries(values) };
}

function setup(initial: Readonly<Record<string, Vector>>) {
  const objects = createObjects(initial);
  const undo = createUndoStack();
  const targetIds = Object.keys(initial);
  const handler = createTargetsChangeHandler<Vector>(() => ({
    undo,
    label: messageRef(messages, 'position'),
    targetIds,
    access: objects.access,
    equals: samePropertyValue,
  }));

  return { ...objects, undo, handler };
}

function setX(x: number): TargetsChange<Vector> {
  return (own) => [x, ...own.slice(1)];
}

describe('readTargetsValue', () => {
  it('shows the first value and reports a mixed value', () => {
    const { access } = createObjects({ a: [1, 2], b: [1, 3] });

    expect(readTargetsValue(access, ['a', 'b'], samePropertyValue)).toEqual({
      value: [1, 2],
      values: [
        [1, 2],
        [1, 3],
      ],
      mixed: true,
    });
    expect(readTargetsValue(access, ['a'], samePropertyValue)?.mixed).toBe(false);
  });

  it('has no value without targets', () => {
    const { access } = createObjects({});

    expect(readTargetsValue(access, [], samePropertyValue)).toBeNull();
  });
});

describe('createTargetsChangeHandler', () => {
  it('applies the change to every target from its own value', () => {
    const { handler, snapshot } = setup({ a: [0, 1], b: [0, 2] });

    handler(setX(5), 'commit');

    expect(snapshot()).toEqual({ a: [5, 1], b: [5, 2] });
  });

  it('records one undo entry for a series of previews and a commit', () => {
    const { handler, snapshot, undo } = setup({ a: [0, 1], b: [0, 2] });

    handler(setX(1), 'preview');
    handler(setX(2), 'preview');
    handler(setX(3), 'commit');
    undo.undo();

    expect(snapshot()).toEqual({ a: [0, 1], b: [0, 2] });

    undo.redo();

    expect(snapshot()).toEqual({ a: [3, 1], b: [3, 2] });
  });

  it('computes every preview from the values at the start of the edit', () => {
    const { handler, snapshot } = setup({ a: [1, 0] });
    const shift: TargetsChange<Vector> = (own) => [(own[0] ?? 0) + 1, ...own.slice(1)];

    handler(shift, 'preview');
    handler(shift, 'preview');

    expect(snapshot()).toEqual({ a: [2, 0] });
  });

  it('passes the value shown at the start of the edit', () => {
    const { handler } = setup({ a: [7, 0], b: [9, 0] });
    const shown: Vector[] = [];

    handler((own, start) => {
      shown.push(start);
      return own;
    }, 'commit');

    expect(shown).toEqual([
      [7, 0],
      [7, 0],
    ]);
  });

  it('restores the start values on cancel and records nothing', () => {
    const { handler, snapshot, undo } = setup({ a: [0, 1], b: [4, 2] });

    handler(setX(9), 'preview');
    handler(setX(9), 'cancel');

    expect(snapshot()).toEqual({ a: [0, 1], b: [4, 2] });
    expect(undo.canUndo()).toBe(false);
  });

  it('records nothing when the commit ends at the start values', () => {
    const { handler, undo } = setup({ a: [1, 1] });

    handler(setX(5), 'preview');
    handler(setX(1), 'commit');

    expect(undo.canUndo()).toBe(false);
  });
});
