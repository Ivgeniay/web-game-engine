import type { VectorDimensions, VectorSpec } from '@/contracts/property';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { VECTOR2_AXES, VECTOR3_AXES, VECTOR4_AXES } from '@/ui/vectorField/vectorAxes';
import type { VectorAxis } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import { DEFAULT_NUMBER_KIND } from './builtInEditorProps';
import type { BuiltInEditorProps } from './builtInEditorProps';
import { mergeChangedComponents, mixedComponents } from './componentChanges';

const AXES: Readonly<Record<VectorDimensions, readonly VectorAxis[]>> = {
  2: VECTOR2_AXES,
  3: VECTOR3_AXES,
  4: VECTOR4_AXES,
};

export function VectorEditor({
  spec,
  label,
  value,
  values,
  readOnly,
  onTargetsChange,
}: BuiltInEditorProps<readonly number[], VectorSpec>) {
  const { dimensions, kind = DEFAULT_NUMBER_KIND, min, max, step } = spec;
  const invalidMessages = useNumberFieldMessages({ min, max });

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <VectorField
          id={id}
          aria-labelledby={labelId}
          axes={AXES[dimensions]}
          value={value}
          mixed={mixedComponents(values)}
          kind={kind}
          min={min}
          max={max}
          step={step}
          readOnly={readOnly}
          invalidMessages={invalidMessages}
          onValueChange={(next, phase) => {
            onTargetsChange((own, shown) => mergeChangedComponents(own, next, shown), phase);
          }}
        />
      )}
    </PropertyRow>
  );
}
