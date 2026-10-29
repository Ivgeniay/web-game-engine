import { describe, expect, it } from 'vitest';
import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import { isCommittedValueField } from './textInput';

function inputWith(state: string | null): HTMLInputElement {
  const input = document.createElement('input');

  if (state !== null) {
    input.setAttribute(VALUE_EDIT_ATTRIBUTE, state);
  }

  return input;
}

describe('isCommittedValueField', () => {
  it('accepts only a value field without uncommitted typing', () => {
    expect(isCommittedValueField(inputWith('committed'))).toBe(true);
    expect(isCommittedValueField(inputWith('uncommitted'))).toBe(false);
    expect(isCommittedValueField(inputWith(null))).toBe(false);
  });
});
