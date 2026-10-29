import { useMemo } from 'react';
import type { EnumSpec } from '@/contracts/property';
import { useTranslate } from '@/state/language/useTranslate';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function EnumEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  onValueChange,
}: BuiltInEditorProps<string, EnumSpec>) {
  const translate = useTranslate();
  const options = useMemo<readonly SelectEntry<string>[]>(
    () =>
      spec.options.map((option) => ({
        kind: 'option',
        value: option.value,
        label: translate(option.label),
      })),
    [spec.options, translate],
  );

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Select
          id={id}
          aria-labelledby={labelId}
          options={options}
          value={mixed ? null : value}
          placeholder={MIXED_VALUE_PLACEHOLDER}
          disabled={readOnly}
          onValueChange={(next) => {
            onValueChange(next, 'commit');
          }}
        />
      )}
    </PropertyRow>
  );
}
