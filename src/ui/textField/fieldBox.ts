import { classNames } from '@/ui/classNames';
import styles from './fieldBox.module.css';

export const FIELD_SIZES = ['sm', 'md', 'lg'] as const;

export type FieldSize = (typeof FIELD_SIZES)[number];

export const MIXED_VALUE_PLACEHOLDER = '—';

export interface FieldBoxClassNameOptions {
  readonly size: FieldSize;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly className: string | undefined;
}

export function fieldBoxClassName({
  size,
  invalid,
  disabled,
  readOnly,
  className,
}: FieldBoxClassNameOptions): string {
  return classNames(
    styles.root,
    styles[size],
    invalid && styles.invalid,
    disabled && styles.disabled,
    readOnly && styles.readOnly,
    className,
  );
}

export const fieldInputClassName = styles.input;

export function joinIds(...ids: readonly (string | undefined)[]): string | undefined {
  const joined = ids.filter((id) => id !== undefined && id !== '').join(' ');

  return joined === '' ? undefined : joined;
}
