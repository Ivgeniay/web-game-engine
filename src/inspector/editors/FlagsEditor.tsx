import { useMemo } from 'react';
import type { FlagsSpec } from '@/contracts/property';
import { useFlagsFieldLabels } from '@/state/fields/useFlagsFieldLabels';
import { useTranslate } from '@/state/language/useTranslate';
import { FlagsField } from '@/ui/flagsField/FlagsField';
import { applyFlagsChange } from '@/ui/flagsField/flagsValue';
import type { FlagOption } from '@/ui/flagsField/flagsValue';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function FlagsEditor({
  spec,
  label,
  values,
  readOnly,
  onTargetsChange,
}: BuiltInEditorProps<readonly string[], FlagsSpec>) {
  const translate = useTranslate();
  const labels = useFlagsFieldLabels();
  const options = useMemo<readonly FlagOption<string>[]>(
    () => spec.options.map((option) => ({ value: option.value, label: translate(option.label) })),
    [spec.options, translate],
  );
  const flags = options.map((option) => option.value);
  const on = flags.filter((flag) => values.every((value) => value.includes(flag)));
  const mixedFlags = flags.filter(
    (flag) => !on.includes(flag) && values.some((value) => value.includes(flag)),
  );

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <FlagsField
          {...labels}
          id={id}
          aria-labelledby={labelId}
          options={options}
          value={on}
          mixedFlags={mixedFlags}
          disabled={readOnly}
          onValueChange={(change, phase) => {
            onTargetsChange((own) => applyFlagsChange(own, change, options), phase);
          }}
        />
      )}
    </PropertyRow>
  );
}
