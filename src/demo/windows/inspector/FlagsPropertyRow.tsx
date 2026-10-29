import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useFlagsFieldLabels } from '@/state/fields/useFlagsFieldLabels';
import { FlagsField } from '@/ui/flagsField/FlagsField';
import { applyFlagsChange } from '@/ui/flagsField/flagsValue';
import type { FlagOption, FlagsChange } from '@/ui/flagsField/flagsValue';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { useSelectionProperty } from './useSelectionProperty';

interface FlagsPropertyRowProps<T extends string> {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly options: readonly FlagOption<T>[];
  readonly get: (object: SceneObject) => readonly T[];
  readonly set: (object: SceneObject, value: readonly T[]) => SceneObject;
}

const NO_FLAGS: readonly never[] = [];

function sameFlags<T extends string>(first: FlagsChange<T>, second: FlagsChange<T>): boolean {
  return first.on.length === second.on.length && first.on.every((flag) => second.on.includes(flag));
}

export function FlagsPropertyRow<T extends string>({
  objects,
  label,
  undoLabel,
  options,
  get,
  set,
}: FlagsPropertyRowProps<T>) {
  const labels = useFlagsFieldLabels();
  const { onValueChange } = useSelectionProperty<FlagsChange<T>>({
    objects,
    label: undoLabel,
    get: (object) => ({ on: get(object), mixed: NO_FLAGS }),
    set: (object, change) => set(object, applyFlagsChange(get(object), change, options)),
    equals: sameFlags,
  });
  const flags = options.map((option) => option.value);
  const on = flags.filter((flag) => objects.every((object) => get(object).includes(flag)));
  const mixedFlags = flags.filter(
    (flag) => !on.includes(flag) && objects.some((object) => get(object).includes(flag)),
  );

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <FlagsField
          {...labels}
          id={id}
          aria-labelledby={labelId}
          options={options}
          value={on}
          mixedFlags={mixedFlags}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}
