import type { Bounds } from '@/contracts/geometry';
import type { BoundsSpec } from '@/contracts/property';
import { useBoundsFieldLabels } from '@/state/fields/useBoundsFieldLabels';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { BoundsField } from '@/ui/boundsField/BoundsField';
import { replaceComponent } from '@/ui/vectorField/vectorAxes';
import { DEFAULT_NUMBER_KIND } from './builtInEditorProps';
import type { BuiltInEditorProps } from './builtInEditorProps';
import { mixedBounds } from './mixedComponents';

export function BoundsEditor({
  spec,
  label,
  value,
  values,
  readOnly,
  onTargetsChange,
}: BuiltInEditorProps<Bounds, BoundsSpec>) {
  const labels = useBoundsFieldLabels();
  const invalidMessages = useNumberFieldMessages();

  return (
    <BoundsField
      {...labels}
      label={label}
      value={value}
      mixed={mixedBounds(values)}
      kind={spec.kind ?? DEFAULT_NUMBER_KIND}
      readOnly={readOnly}
      invalidMessages={invalidMessages}
      onComponentChange={(part, index, component, phase) => {
        onTargetsChange(
          (own) => ({ ...own, [part]: replaceComponent(own[part], index, component) }),
          phase,
        );
      }}
    />
  );
}
