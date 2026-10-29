import type { Rect } from '@/contracts/geometry';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { VectorAxis } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './RectField.module.css';

export type RectMixed = Readonly<Partial<Record<keyof Rect, boolean>>>;

const RECT_POSITION_AXES: readonly VectorAxis[] = [
  { label: 'X', mark: 'x' },
  { label: 'Y', mark: 'y' },
];

const RECT_SIZE_AXES: readonly VectorAxis[] = [{ label: 'W' }, { label: 'H' }];

interface RectFieldBaseProps {
  readonly value: Rect;
  readonly onValueChange?: ValueChangeHandler<Rect> | undefined;
  readonly mixed?: RectMixed | undefined;
  readonly kind?: NumberKind;
  readonly invalidMessages: NumberFieldMessages;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly size?: FieldSize;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
}

type GroupLabelling =
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: never }
  | { readonly 'aria-label'?: never; readonly 'aria-labelledby': string };

type RectFieldProps = RectFieldBaseProps & GroupLabelling;

const NOT_MIXED = false;

export function RectField(props: RectFieldProps) {
  const {
    value,
    onValueChange,
    mixed = {},
    kind = 'float',
    invalidMessages,
    disabled,
    readOnly,
    size = 'md',
    id,
    className,
  } = props;
  const labelling: GroupLabelling =
    props['aria-labelledby'] !== undefined
      ? { 'aria-labelledby': props['aria-labelledby'] }
      : { 'aria-label': props['aria-label'] };
  const common = { kind, invalidMessages, disabled, readOnly, size, ...labelling };

  return (
    <div className={classNames(styles.root, className)} role="group" {...labelling}>
      <VectorField
        {...common}
        id={id}
        axes={RECT_POSITION_AXES}
        value={[value.x, value.y]}
        mixed={[mixed.x ?? NOT_MIXED, mixed.y ?? NOT_MIXED]}
        onValueChange={(next, phase) => {
          onValueChange?.({ ...value, x: next[0] ?? value.x, y: next[1] ?? value.y }, phase);
        }}
      />
      <VectorField
        {...common}
        axes={RECT_SIZE_AXES}
        value={[value.width, value.height]}
        mixed={[mixed.width ?? NOT_MIXED, mixed.height ?? NOT_MIXED]}
        onValueChange={(next, phase) => {
          onValueChange?.(
            { ...value, width: next[0] ?? value.width, height: next[1] ?? value.height },
            phase,
          );
        }}
      />
    </div>
  );
}
