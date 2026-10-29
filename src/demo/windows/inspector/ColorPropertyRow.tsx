import type { Color } from '@/contracts/color';
import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useColorFieldLabels } from '@/state/fields/useColorFieldLabels';
import { sameColor } from '@/ui/color/colorModel';
import { ColorField } from '@/ui/colorField/ColorField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { useSelectionProperty } from './useSelectionProperty';

interface ColorPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => Color;
  readonly set: (object: SceneObject, value: Color) => SceneObject;
}

export function ColorPropertyRow({ objects, label, undoLabel, get, set }: ColorPropertyRowProps) {
  const labels = useColorFieldLabels();
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
    equals: sameColor,
  });

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <ColorField
          id={id}
          aria-labelledby={labelId}
          value={value}
          mixed={mixed}
          labels={labels}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
