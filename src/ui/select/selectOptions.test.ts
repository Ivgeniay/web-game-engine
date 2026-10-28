import { describe, expect, it } from 'vitest';
import { findSelectedOption, selectedListIndex, selectOptionsOf } from './selectOptions';
import type { SelectEntry } from './selectOptions';

type Quality = 'low' | 'medium' | 'high';

const ENTRIES: readonly SelectEntry<Quality>[] = [
  { kind: 'option', value: 'low', label: 'Low' },
  { kind: 'separator', id: 'first' },
  { kind: 'option', value: 'medium', label: 'Medium', disabled: true },
  { kind: 'separator', id: 'second' },
  { kind: 'option', value: 'high', label: 'High' },
];

describe('select options', () => {
  it('keeps only the options in their order', () => {
    expect(selectOptionsOf(ENTRIES).map((option) => option.value)).toEqual([
      'low',
      'medium',
      'high',
    ]);
  });

  it('finds the selected option', () => {
    expect(findSelectedOption(ENTRIES, 'high')?.label).toBe('High');
    expect(findSelectedOption(ENTRIES, null)).toBeUndefined();
  });

  it('counts the list index of the selected option without separators', () => {
    expect(selectedListIndex(ENTRIES, 'low')).toBe(0);
    expect(selectedListIndex(ENTRIES, 'medium')).toBe(1);
    expect(selectedListIndex(ENTRIES, 'high')).toBe(2);
  });

  it('has no selected index for an empty value', () => {
    expect(selectedListIndex(ENTRIES, null)).toBeNull();
  });
});
