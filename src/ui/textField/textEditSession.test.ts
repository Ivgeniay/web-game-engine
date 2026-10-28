import { describe, expect, it } from 'vitest';
import { cancelTextEdit, editText, finishTextEdit } from './textEditSession';
import type { TextEditSession, TextReading } from './textEditSession';

const START = { value: 'Cube', mixed: false };
const MIXED_START = { value: 'Cube', mixed: true };
const MESSAGE = 'Invalid';

function session(overrides: Partial<TextEditSession<string>> = {}): TextEditSession<string> {
  return { initial: 'Cube', draft: 'Cube', previewed: false, mixed: false, ...overrides };
}

function valid<T>(value: T): TextReading<T> {
  return { valid: true, value };
}

function invalid<T>(fallback: T | undefined): TextReading<T> {
  return { valid: false, message: MESSAGE, fallback };
}

describe('editText', () => {
  it('starts a session from the current value', () => {
    expect(editText(null, START, 'Cub', false)).toEqual(session({ draft: 'Cub' }));
  });

  it('keeps the initial value of a running session', () => {
    const next = editText(session({ draft: 'Cub' }), { value: 'Other', mixed: false }, 'Cu', false);

    expect(next.initial).toBe('Cube');
    expect(next.draft).toBe('Cu');
  });

  it('remembers that a draft was previewed', () => {
    const first = editText(null, START, 'Cube 1', true);
    const second = editText(first, START, 'Cube 12', false);

    expect(first.previewed).toBe(true);
    expect(second.previewed).toBe(true);
  });
});

describe('finishTextEdit', () => {
  it('does nothing without a session', () => {
    expect(finishTextEdit(null, valid('Cube'))).toBeNull();
  });

  it('commits a changed value', () => {
    expect(finishTextEdit(session({ draft: 'Sphere' }), valid('Sphere'))).toEqual({
      phase: 'commit',
      value: 'Sphere',
    });
  });

  it('skips the commit when the value came back unchanged', () => {
    expect(finishTextEdit(session(), valid('Cube'))).toBeNull();
  });

  it('compares values, not texts', () => {
    const numberSession = { initial: 1.5, draft: '1,50', previewed: false, mixed: false };

    expect(finishTextEdit(numberSession, valid(1.5))).toBeNull();
  });

  it('commits an unchanged value after a preview', () => {
    expect(finishTextEdit(session({ previewed: true }), valid('Cube'))).toEqual({
      phase: 'commit',
      value: 'Cube',
    });
  });

  it('commits any edit of a mixed value', () => {
    expect(finishTextEdit(editText(null, MIXED_START, 'Cube', false), valid('Cube'))).toEqual({
      phase: 'commit',
      value: 'Cube',
    });
  });

  it('commits the fallback of an invalid value', () => {
    const numberSession = { initial: 5, draft: '150', previewed: false, mixed: false };

    expect(finishTextEdit(numberSession, invalid(100))).toEqual({ phase: 'commit', value: 100 });
  });

  it('drops an invalid value without a fallback or a preview', () => {
    expect(finishTextEdit(session({ draft: '' }), invalid(undefined))).toBeNull();
  });

  it('cancels an invalid value without a fallback after a preview', () => {
    expect(finishTextEdit(session({ draft: '', previewed: true }), invalid(undefined))).toEqual({
      phase: 'cancel',
      value: 'Cube',
    });
  });
});

describe('cancelTextEdit', () => {
  it('does nothing when nothing was previewed', () => {
    expect(cancelTextEdit(null)).toBeNull();
    expect(cancelTextEdit(session({ draft: 'Sphere' }))).toBeNull();
  });

  it('returns the initial value after a preview', () => {
    expect(cancelTextEdit(session({ draft: 'Sphere', previewed: true }))).toEqual({
      phase: 'cancel',
      value: 'Cube',
    });
  });
});
