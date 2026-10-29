import type { PropertyEditorProps, PropertyNumberKind } from '@/contracts/property';

export const DEFAULT_NUMBER_KIND: PropertyNumberKind = 'float';

export interface SpecProps<S> {
  readonly spec: S;
}

export type BuiltInEditorProps<T, S> = PropertyEditorProps<T> & SpecProps<S>;
