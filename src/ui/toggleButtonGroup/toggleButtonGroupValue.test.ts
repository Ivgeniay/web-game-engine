import { describe, expect, it } from 'vitest';
import { isOptionSelected, toggleMultipleValue } from './toggleButtonGroupValue';

type Axis = 'x' | 'y' | 'z';

const ORDER: readonly Axis[] = ['x', 'y', 'z'];

describe('isOptionSelected', () => {
  it('matches the single value', () => {
    expect(isOptionSelected<Axis>({ selection: 'single', value: 'x' }, 'x')).toBe(true);
    expect(isOptionSelected<Axis>({ selection: 'single', value: 'x' }, 'y')).toBe(false);
  });

  it('selects nothing for an empty optional value', () => {
    expect(isOptionSelected<Axis>({ selection: 'optional', value: null }, 'x')).toBe(false);
    expect(isOptionSelected<Axis>({ selection: 'optional', value: 'y' }, 'y')).toBe(true);
  });

  it('looks for the option in a multiple value', () => {
    expect(isOptionSelected<Axis>({ selection: 'multiple', value: ['x', 'z'] }, 'z')).toBe(true);
    expect(isOptionSelected<Axis>({ selection: 'multiple', value: ['x', 'z'] }, 'y')).toBe(false);
  });
});

describe('toggleMultipleValue', () => {
  it('adds a pressed option in the order of the options', () => {
    expect(toggleMultipleValue<Axis>(['z'], 'x', true, ORDER)).toEqual(['x', 'z']);
  });

  it('removes a released option', () => {
    expect(toggleMultipleValue<Axis>(['x', 'y', 'z'], 'y', false, ORDER)).toEqual(['x', 'z']);
  });

  it('keeps the value when the option is already in that state', () => {
    expect(toggleMultipleValue<Axis>(['x'], 'x', true, ORDER)).toEqual(['x']);
    expect(toggleMultipleValue<Axis>(['x'], 'y', false, ORDER)).toEqual(['x']);
  });
});
