export const VALUE_CHANGE_PHASES = ['preview', 'commit', 'cancel'] as const;

export type ValueChangePhase = (typeof VALUE_CHANGE_PHASES)[number];

export type ValueChangeHandler<T> = (value: T, phase: ValueChangePhase) => void;
