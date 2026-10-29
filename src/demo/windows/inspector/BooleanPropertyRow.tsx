import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { useSelectionProperty } from './useSelectionProperty';

interface BooleanPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => boolean;
  readonly set: (object: SceneObject, value: boolean) => SceneObject;
}

export function BooleanPropertyRow({
  objects,
  label,
  undoLabel,
  get,
  set,
}: BooleanPropertyRowProps) {
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
  });

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Checkbox
          id={id}
          aria-labelledby={labelId}
          checked={mixed ? 'mixed' : value}
          onCheckedChange={(checked) => {
            onValueChange(checked, 'commit');
          }}
        />
      )}
    </PropertyRow>
  );
}
