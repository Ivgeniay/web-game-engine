import { describe, expect, it } from 'vitest';
import { cancelTextEdit, editText, finishTextEdit } from './textEditSession';
import type { TextEditSession } from './textEditSession';

const START = { value: 'Cube', mixed: false };
const MIXED_START = { value: 'Cube', mixed: true };

function session(overrides: Partial<TextEditSession> = {}): TextEditSession {
  return { initial: 'Cube', draft: 'Cube', previewed: false, mixed: false, ...overrides };
}

describe('editText', () => {
  it('starts a session from the current value', () => {
    expect(editText(null, START, 'Cub', false)).toEqual({
      session: session({ draft: 'Cub' }),
      preview: undefined,
    });
  });

  it('keeps the initial value of a running session', () => {
    const step = editText(session({ draft: 'Cub' }), { value: 'Other', mixed: false }, 'Cu', false);

    expect(step.session.initial).toBe('Cube');
    expect(step.session.draft).toBe('Cu');
  });

  it('previews the draft and remembers that it did', () => {
    const first = editText(null, START, 'Cube 1', true);
    const second = editText(first.session, START, 'Cube 12', false);

    expect(first.preview).toBe('Cube 1');
    expect(second.preview).toBeUndefined();
    expect(second.session.previewed).toBe(true);
  });
});

describe('finishTextEdit', () => {
  it('does nothing without a session', () => {
    expect(finishTextEdit(null, true)).toBeNull();
  });

  it('commits a changed draft', () => {
    expect(finishTextEdit(session({ draft: 'Sphere' }), true)).toEqual({
      phase: 'commit',
      value: 'Sphere',
    });
  });

  it('skips the commit when the text came back unchanged', () => {
    expect(finishTextEdit(session(), true)).toBeNull();
  });

  it('commits an unchanged draft after a preview', () => {
    expect(finishTextEdit(session({ previewed: true }), true)).toEqual({
      phase: 'commit',
      value: 'Cube',
    });
  });

  it('commits any edit of a mixed value', () => {
    const step = editText(null, MIXED_START, 'Cube', false);

    expect(finishTextEdit(step.session, true)).toEqual({ phase: 'commit', value: 'Cube' });
  });

  it('drops an invalid draft without a preview', () => {
    expect(finishTextEdit(session({ draft: '' }), false)).toBeNull();
  });

  it('cancels an invalid draft after a preview', () => {
    expect(finishTextEdit(session({ draft: '', previewed: true }), false)).toEqual({
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
