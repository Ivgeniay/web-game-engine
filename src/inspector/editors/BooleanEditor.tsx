import type { PropertyEditorProps } from '@/contracts/property';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';

export function BooleanEditor({
  label,
  value,
  mixed,
  readOnly,
  onValueChange,
}: PropertyEditorProps<boolean>) {
  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Checkbox
          id={id}
          aria-labelledby={labelId}
          checked={mixed ? 'mixed' : value}
          disabled={readOnly}
          onCheckedChange={(checked) => {
            onValueChange(checked, 'commit');
          }}
        />
      )}
    </PropertyRow>
  );
}
