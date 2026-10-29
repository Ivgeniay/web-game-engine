import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import { useSelectionProperty } from './useSelectionProperty';

type Vector = readonly number[];

interface VectorPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => Vector;
  readonly set: (object: SceneObject, value: Vector) => SceneObject;
  readonly step?: number | undefined;
}

function mergeChangedAxes(own: Vector, value: Vector, shown: Vector): Vector {
  return own.map((component, axis) =>
    value[axis] === shown[axis] ? component : (value[axis] ?? component),
  );
}

export function VectorPropertyRow({
  objects,
  label,
  undoLabel,
  get,
  set,
  step,
}: VectorPropertyRowProps) {
  const invalidMessages = useNumberFieldMessages();
  const { value, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
    merge: mergeChangedAxes,
  });
  const mixed = value.map((component, axis) =>
    objects.some((object) => get(object)[axis] !== component),
  );

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <VectorField
          id={id}
          aria-labelledby={labelId}
          axes={VECTOR3_AXES}
          value={value}
          mixed={mixed}
          step={step}
          invalidMessages={invalidMessages}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
