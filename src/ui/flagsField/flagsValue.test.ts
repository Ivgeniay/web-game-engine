import { describe, expect, it } from 'vitest';
import {
  applyFlagsChange,
  flagCheckedState,
  flagsSummary,
  hasAllFlags,
  hasNoFlags,
  setAllFlags,
  toggleFlag,
} from './flagsValue';
import type { FlagOption, FlagsState } from './flagsValue';

type Axis = 'x' | 'y' | 'z';

const OPTIONS: readonly FlagOption<Axis>[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'z', label: 'Z' },
];
const LABELS = { none: 'Nothing', all: 'Everything', mixed: 'Mixed' };

function state(value: readonly Axis[], mixedFlags: readonly Axis[] = []): FlagsState<Axis> {
  return { options: OPTIONS, value, mixedFlags };
}

describe('flagsSummary', () => {
  it('names nothing, everything and the chosen flags in option order', () => {
    expect(flagsSummary(state([]), LABELS)).toBe('Nothing');
    expect(flagsSummary(state(['z', 'x', 'y']), LABELS)).toBe('Everything');
    expect(flagsSummary(state(['z', 'x']), LABELS)).toBe('X, Z');
  });

  it('says mixed when some flag differs between objects', () => {
    expect(flagsSummary(state(['x'], ['y']), LABELS)).toBe('Mixed');
  });

  it('ignores values that are not options', () => {
    const unknown: FlagsState<Axis> = {
      options: OPTIONS.slice(0, 2),
      value: ['z'],
      mixedFlags: [],
    };

    expect(flagsSummary(unknown, LABELS)).toBe('Nothing');
    expect(hasNoFlags(unknown)).toBe(true);
  });
});

describe('flag states', () => {
  it('reads a flag as on, off or mixed', () => {
    expect(flagCheckedState(state(['x'], ['y']), 'x')).toBe(true);
    expect(flagCheckedState(state(['x'], ['y']), 'y')).toBe('mixed');
    expect(flagCheckedState(state(['x'], ['y']), 'z')).toBe(false);
  });

  it('knows when no flag and when every flag is on', () => {
    expect(hasNoFlags(state([], ['x']))).toBe(false);
    expect(hasAllFlags(state(['x', 'y', 'z']))).toBe(true);
    expect(hasAllFlags(state(['x', 'y'], ['z']))).toBe(false);
  });
});

describe('toggleFlag', () => {
  it('resolves the toggled flag and keeps the other mixed flags', () => {
    expect(toggleFlag(state(['x'], ['y', 'z']), 'y', true)).toEqual({
      on: ['x', 'y'],
      mixed: ['z'],
    });
    expect(toggleFlag(state(['x', 'y']), 'x', false)).toEqual({ on: ['y'], mixed: [] });
  });
});

describe('setAllFlags', () => {
  it('turns every flag on or off and leaves disabled flags as they are', () => {
    const withDisabled: FlagsState<Axis> = {
      options: [...OPTIONS.slice(0, 2), { value: 'z', label: 'Z', disabled: true }],
      value: ['z'],
      mixedFlags: ['x'],
    };

    expect(setAllFlags(withDisabled, false)).toEqual({ on: ['z'], mixed: [] });
    expect(setAllFlags(state([], ['x']), true)).toEqual({ on: ['x', 'y', 'z'], mixed: [] });
  });
});

describe('applyFlagsChange', () => {
  it('sets resolved flags and keeps the own state of still mixed flags', () => {
    const change = { on: ['x'], mixed: ['z'] } as const;

    expect(applyFlagsChange(['y', 'z'], change, OPTIONS)).toEqual(['x', 'z']);
    expect(applyFlagsChange(['y'], change, OPTIONS)).toEqual(['x']);
  });
});
