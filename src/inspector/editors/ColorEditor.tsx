import type { Color } from '@/contracts/color';
import type { ColorSpec } from '@/contracts/property';
import { useColorFieldLabels } from '@/state/fields/useColorFieldLabels';
import { ColorField } from '@/ui/colorField/ColorField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function ColorEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  row,
  onValueChange,
}: BuiltInEditorProps<Color, ColorSpec>) {
  const labels = useColorFieldLabels();

  return (
    <PropertyRow label={label} {...row}>
      {({ id, labelId }) => (
        <ColorField
          id={id}
          aria-labelledby={labelId}
          value={value}
          mixed={mixed}
          showAlpha={spec.showAlpha}
          disabled={readOnly}
          labels={labels}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
