import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { Slider } from '@/ui/slider/Slider';
import { useSelectionProperty } from './useSelectionProperty';

interface SliderPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => number;
  readonly set: (object: SceneObject, value: number) => SceneObject;
  readonly min: number;
  readonly max: number;
}

export function SliderPropertyRow({
  objects,
  label,
  undoLabel,
  get,
  set,
  min,
  max,
}: SliderPropertyRowProps) {
  const invalidMessages = useNumberFieldMessages({ min, max });
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
  });

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Slider
          id={id}
          aria-labelledby={labelId}
          value={value}
          mixed={mixed}
          min={min}
          max={max}
          invalidMessages={invalidMessages}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
