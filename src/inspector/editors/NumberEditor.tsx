import type { NumberSpec } from '@/contracts/property';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { Slider } from '@/ui/slider/Slider';
import { DEFAULT_NUMBER_KIND } from './builtInEditorProps';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function NumberEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  onValueChange,
}: BuiltInEditorProps<number, NumberSpec>) {
  const { kind = DEFAULT_NUMBER_KIND, step, min, max } = spec;
  const invalidMessages = useNumberFieldMessages({ min, max });

  if (spec.slider === true) {
    return (
      <PropertyRow label={label}>
        {({ id, labelId }) => (
          <Slider
            id={id}
            aria-labelledby={labelId}
            value={value}
            mixed={mixed}
            min={spec.min}
            max={spec.max}
            kind={kind}
            step={step}
            readOnly={readOnly}
            invalidMessages={invalidMessages}
            onValueChange={onValueChange}
          />
        )}
      </PropertyRow>
    );
  }

  return (
    <PropertyRow
      label={label}
      drag={readOnly ? undefined : { value, onValueChange, kind, min, max, step }}
    >
      {({ id }) => (
        <NumberField
          id={id}
          value={value}
          mixed={mixed}
          kind={kind}
          min={min}
          max={max}
          step={step}
          readOnly={readOnly}
          invalidMessages={invalidMessages}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
