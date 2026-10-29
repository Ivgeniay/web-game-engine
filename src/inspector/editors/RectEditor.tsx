import type { Rect } from '@/contracts/geometry';
import type { RectSpec } from '@/contracts/property';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { RectField } from '@/ui/rectField/RectField';
import { DEFAULT_NUMBER_KIND } from './builtInEditorProps';
import type { BuiltInEditorProps } from './builtInEditorProps';
import { mixedRect } from './mixedComponents';

export function RectEditor({
  spec,
  label,
  value,
  values,
  readOnly,
  row,
  onTargetsChange,
}: BuiltInEditorProps<Rect, RectSpec>) {
  const invalidMessages = useNumberFieldMessages();

  return (
    <PropertyRow label={label} {...row}>
      {({ id, labelId }) => (
        <RectField
          id={id}
          aria-labelledby={labelId}
          value={value}
          mixed={mixedRect(values)}
          kind={spec.kind ?? DEFAULT_NUMBER_KIND}
          readOnly={readOnly}
          invalidMessages={invalidMessages}
          onComponentChange={(key, component, phase) => {
            onTargetsChange((own) => ({ ...own, [key]: component }), phase);
          }}
        />
      )}
    </PropertyRow>
  );
}
