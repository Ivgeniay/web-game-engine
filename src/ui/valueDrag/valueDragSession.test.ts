import { describe, expect, it } from 'vitest';
import type { NumberLimits } from '@/ui/numberField/numberText';
import { moveValueDrag, startValueDrag, VALUE_DRAG_THRESHOLD } from './valueDragSession';
import type { ValueDragOptions, ValueDragState } from './valueDragSession';

const NO_MODIFIERS = { shiftKey: false, altKey: false };
const SHIFT = { shiftKey: true, altKey: false };
const ALT = { shiftKey: false, altKey: true };
const FLOAT: NumberLimits = { kind: 'float', min: undefined, max: undefined };
const OPTIONS: ValueDragOptions = { step: 0.1, limits: FLOAT };

function started(value: number): ValueDragState {
  return moveValueDrag(startValueDrag(value), VALUE_DRAG_THRESHOLD, NO_MODIFIERS, OPTIONS).state;
}

describe('moveValueDrag', () => {
  it('waits for the threshold before changing the value', () => {
    const first = moveValueDrag(startValueDrag(1), 2, NO_MODIFIERS, OPTIONS);
    const back = moveValueDrag(first.state, -2, NO_MODIFIERS, OPTIONS);

    expect(first.preview).toBeUndefined();
    expect(back.preview).toBeUndefined();
    expect(back.state.started).toBe(false);
  });

  it('starts at the threshold without jumping', () => {
    const move = moveValueDrag(startValueDrag(1), -VALUE_DRAG_THRESHOLD, NO_MODIFIERS, OPTIONS);

    expect(move.state.started).toBe(true);
    expect(move.preview).toBe(1);
  });

  it('changes the value by one step per pixel', () => {
    expect(moveValueDrag(started(1), 5, NO_MODIFIERS, OPTIONS).preview).toBe(1.5);
    expect(moveValueDrag(started(1), -5, NO_MODIFIERS, OPTIONS).preview).toBe(0.5);
  });

  it('applies the modifiers to the movement since the last event', () => {
    const fine = moveValueDrag(started(1), 10, SHIFT, OPTIONS);
    const coarse = moveValueDrag(fine.state, 1, ALT, OPTIONS);

    expect(fine.preview).toBe(1.1);
    expect(coarse.preview).toBe(2.1);
  });

  it('turns back from a limit right away', () => {
    const limits: NumberLimits = { kind: 'integer', min: 0, max: 10 };
    const options = { step: 1, limits };
    const pushed = moveValueDrag(started(8), 50, NO_MODIFIERS, options);
    const back = moveValueDrag(pushed.state, -1, NO_MODIFIERS, options);

    expect(pushed.preview).toBe(10);
    expect(back.preview).toBe(9);
  });

  it('rounds integers and keeps fractional pixels for the next move', () => {
    const options = {
      step: 1,
      limits: { kind: 'integer', min: undefined, max: undefined } as const,
    };
    const first = moveValueDrag(started(0), 4, SHIFT, options);
    const second = moveValueDrag(first.state, 2, SHIFT, options);

    expect(first.preview).toBe(0);
    expect(second.preview).toBe(1);
  });
});
