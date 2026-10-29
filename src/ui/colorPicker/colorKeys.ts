import { stepMultiplier } from '@/ui/numberField/numberStep';
import type { StepModifiers } from '@/ui/numberField/numberStep';
import { clampUnit } from '@/ui/color/colorModel';

export interface SaturationBrightness {
  readonly s: number;
  readonly v: number;
}

export const AREA_KEY_STEPS = 100;
export const PAGE_STEP_COUNT = 10;

const STRIP_DIRECTIONS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -PAGE_STEP_COUNT,
  PageUp: PAGE_STEP_COUNT,
};

const AREA_SATURATION_DIRECTIONS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

const AREA_BRIGHTNESS_DIRECTIONS: Readonly<Record<string, number>> = {
  ArrowDown: -1,
  ArrowUp: 1,
  PageDown: -PAGE_STEP_COUNT,
  PageUp: PAGE_STEP_COUNT,
};

export function stripKeyValue(
  key: string,
  modifiers: StepModifiers,
  value: number,
  steps: number,
): number | undefined {
  if (key === 'Home') {
    return 0;
  }

  if (key === 'End') {
    return 1;
  }

  const direction = STRIP_DIRECTIONS[key];

  return direction === undefined
    ? undefined
    : clampUnit(value + (direction * stepMultiplier(modifiers)) / steps);
}

export function areaKeyValue(
  key: string,
  modifiers: StepModifiers,
  { s, v }: SaturationBrightness,
): SaturationBrightness | undefined {
  const step = stepMultiplier(modifiers) / AREA_KEY_STEPS;
  const saturation = AREA_SATURATION_DIRECTIONS[key];

  if (saturation !== undefined) {
    return { s: clampUnit(s + saturation * step), v };
  }

  const brightness = AREA_BRIGHTNESS_DIRECTIONS[key];

  if (brightness !== undefined) {
    return { s, v: clampUnit(v + brightness * step) };
  }

  if (key === 'Home' || key === 'End') {
    return { s: key === 'Home' ? 0 : 1, v };
  }

  return undefined;
}
