import { useId } from 'react';
import type { Bounds } from '@/contracts/geometry';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import { Label } from '@/ui/label/Label';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './BoundsField.module.css';

export interface BoundsMixed {
  readonly center?: readonly boolean[] | undefined;
  readonly size?: readonly boolean[] | undefined;
}

interface BoundsFieldProps {
  readonly label: string;
  readonly centerLabel: string;
  readonly sizeLabel: string;
  readonly value: Bounds;
  readonly onValueChange?: ValueChangeHandler<Bounds> | undefined;
  readonly mixed?: BoundsMixed | undefined;
  readonly kind?: NumberKind;
  readonly invalidMessages: NumberFieldMessages;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly depth?: number | undefined;
  readonly className?: string | undefined;
}

const NO_DEPTH = 0;

export function BoundsField({
  label,
  centerLabel,
  sizeLabel,
  value,
  onValueChange,
  mixed = {},
  kind = 'float',
  invalidMessages,
  disabled = false,
  readOnly = false,
  depth = NO_DEPTH,
  className,
}: BoundsFieldProps) {
  const captionId = useId();
  const common = { kind, invalidMessages, disabled, readOnly, axes: VECTOR3_AXES };

  return (
    <div className={classNames(styles.root, className)} role="group" aria-labelledby={captionId}>
      <div
        className={styles.caption}
        style={
          depth > NO_DEPTH
            ? { paddingInlineStart: `calc(var(--space-12) * ${String(depth)})` }
            : undefined
        }
      >
        <Label id={captionId} tone={disabled ? 'disabled' : 'primary'} truncate>
          {label}
        </Label>
      </div>
      <PropertyRow label={centerLabel} depth={depth + 1} disabled={disabled}>
        {({ id, labelId }) => (
          <VectorField
            {...common}
            id={id}
            aria-labelledby={`${captionId} ${labelId}`}
            value={value.center}
            mixed={mixed.center}
            onValueChange={(center, phase) => {
              onValueChange?.({ ...value, center }, phase);
            }}
          />
        )}
      </PropertyRow>
      <PropertyRow label={sizeLabel} depth={depth + 1} disabled={disabled}>
        {({ id, labelId }) => (
          <VectorField
            {...common}
            id={id}
            aria-labelledby={`${captionId} ${labelId}`}
            value={value.size}
            mixed={mixed.size}
            onValueChange={(size, phase) => {
              onValueChange?.({ ...value, size }, phase);
            }}
          />
        )}
      </PropertyRow>
    </div>
  );
}
