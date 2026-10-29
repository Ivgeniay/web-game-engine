import type { MessageRef } from '@/core/i18n/translate';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { TextArea } from '@/ui/textArea/TextArea';
import { useSelectionProperty } from './useSelectionProperty';

interface TextAreaPropertyRowProps {
  readonly objects: readonly SceneObject[];
  readonly label: string;
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => string;
  readonly set: (object: SceneObject, value: string) => SceneObject;
}

export function TextAreaPropertyRow({
  objects,
  label,
  undoLabel,
  get,
  set,
}: TextAreaPropertyRowProps) {
  const { value, mixed, onValueChange } = useSelectionProperty({
    objects,
    label: undoLabel,
    get,
    set,
  });

  return (
    <PropertyRow label={label}>
      {({ id }) => <TextArea id={id} value={value} mixed={mixed} onValueChange={onValueChange} />}
    </PropertyRow>
  );
}
