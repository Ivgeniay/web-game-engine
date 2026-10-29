import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { useSelectionProperty } from './useSelectionProperty';

interface NumberPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => number;
  readonly set: (object: SceneObject, value: number) => SceneObject;
  readonly min?: number | undefined;
}

export function NumberPropertyRow({
  objects,
  label,
  undoLabel,
  get,
  set,
  min,
}: NumberPropertyRowProps) {
  const invalidMessages = useNumberFieldMessages({ min });
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
  });

  return (
    <PropertyRow label={label} drag={{ value, onValueChange, min }}>
      {({ id }) => (
        <NumberField
          id={id}
          value={value}
          mixed={mixed}
          min={min}
          invalidMessages={invalidMessages}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
