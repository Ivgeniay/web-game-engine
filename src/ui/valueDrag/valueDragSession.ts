import { offsetNumber, stepMultiplier } from '@/ui/numberField/numberStep';
import type { StepModifiers } from '@/ui/numberField/numberStep';
import type { NumberLimits } from '@/ui/numberField/numberText';

export const VALUE_DRAG_THRESHOLD = 3;

export interface ValueDragOptions {
  readonly step: number;
  readonly limits: NumberLimits;
}

export interface ValueDragState {
  readonly startValue: number;
  readonly travel: number;
  readonly started: boolean;
  readonly stepCount: number;
  readonly value: number;
}

export interface ValueDragMove {
  readonly state: ValueDragState;
  readonly preview: number | undefined;
}

export function startValueDrag(value: number): ValueDragState {
  return { startValue: value, travel: 0, started: false, stepCount: 0, value };
}

function unbounded(limits: NumberLimits): NumberLimits {
  return { ...limits, min: undefined, max: undefined };
}

export function moveValueDrag(
  state: ValueDragState,
  movement: number,
  modifiers: StepModifiers,
  { step, limits }: ValueDragOptions,
): ValueDragMove {
  if (!state.started) {
    const travel = state.travel + movement;

    if (Math.abs(travel) < VALUE_DRAG_THRESHOLD) {
      return { state: { ...state, travel }, preview: undefined };
    }

    return { state: { ...state, travel, started: true }, preview: state.value };
  }

  const stepCount = state.stepCount + movement * stepMultiplier(modifiers);
  const value = offsetNumber(state.startValue, stepCount, step, limits);
  const free = offsetNumber(state.startValue, stepCount, step, unbounded(limits));
  const anchoredStepCount = value === free ? stepCount : (value - state.startValue) / step;

  return { state: { ...state, stepCount: anchoredStepCount, value }, preview: value };
}
