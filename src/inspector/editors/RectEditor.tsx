import type { Rect } from '@/contracts/geometry';
import type { RectSpec } from '@/contracts/property';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { RectField } from '@/ui/rectField/RectField';
import { DEFAULT_NUMBER_KIND } from './builtInEditorProps';
import type { BuiltInEditorProps } from './builtInEditorProps';
import { mergeChangedRect, mixedRect } from './componentChanges';

export function RectEditor({
  spec,
  label,
  value,
  values,
  readOnly,
  onTargetsChange,
}: BuiltInEditorProps<Rect, RectSpec>) {
  const invalidMessages = useNumberFieldMessages();

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <RectField
          id={id}
          aria-labelledby={labelId}
          value={value}
          mixed={mixedRect(values)}
          kind={spec.kind ?? DEFAULT_NUMBER_KIND}
          readOnly={readOnly}
          invalidMessages={invalidMessages}
          onValueChange={(next, phase) => {
            onTargetsChange((own, shown) => mergeChangedRect(own, next, shown), phase);
          }}
        />
      )}
    </PropertyRow>
  );
}
