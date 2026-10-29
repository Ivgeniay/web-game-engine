import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import { useSelectionProperty } from './useSelectionProperty';

interface ChoicePropertyRowProps<T extends string> {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly options: readonly SelectEntry<T>[];
  readonly get: (object: SceneObject) => T;
  readonly set: (object: SceneObject, value: T) => SceneObject;
}

export function ChoicePropertyRow<T extends string>({
  objects,
  label,
  undoLabel,
  options,
  get,
  set,
}: ChoicePropertyRowProps<T>) {
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
  });

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Select
          id={id}
          aria-labelledby={labelId}
          options={options}
          value={mixed ? null : value}
          placeholder={MIXED_VALUE_PLACEHOLDER}
          onValueChange={(next) => {
            onValueChange(next, 'commit');
          }}
        />
      )}
    </PropertyRow>
  );
}
