export const VALUE_CHANGE_PHASES = ['preview', 'commit', 'cancel'] as const;

export type ValueChangePhase = (typeof VALUE_CHANGE_PHASES)[number];

export type ValueChangeHandler<T> = (value: T, phase: ValueChangePhase) => void;

export const VALUE_EDIT_ATTRIBUTE = 'data-value-edit';

export const VALUE_EDIT_STATES = ['committed', 'uncommitted'] as const;

export type ValueEditState = (typeof VALUE_EDIT_STATES)[number];
