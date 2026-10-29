import type { ReactNode } from 'react';
import type {
  PropertyCommon,
  PropertyDescription,
  PropertyEditorProps,
} from '@/contracts/property';
import { samePropertyValue } from '@/core/inspector/propertyValue';
import { useTranslate } from '@/state/language/useTranslate';
import { BooleanEditor } from './editors/BooleanEditor';
import { BoundsEditor } from './editors/BoundsEditor';
import { ColorEditor } from './editors/ColorEditor';
import { CustomEditor } from './editors/CustomEditor';
import { EnumEditor } from './editors/EnumEditor';
import { FlagsEditor } from './editors/FlagsEditor';
import { ListPropertyEditor } from './editors/ListPropertyEditor';
import { NumberEditor } from './editors/NumberEditor';
import { RectEditor } from './editors/RectEditor';
import { ReferenceEditor } from './editors/ReferenceEditor';
import { StringEditor } from './editors/StringEditor';
import { VectorEditor } from './editors/VectorEditor';
import { usePropertyRowSlots } from './usePropertyRowSlots';
import { useTargetsValue } from './useTargetsValue';

interface PropertyFieldProps {
  readonly property: PropertyDescription;
  readonly targetIds: readonly string[];
}

interface BoundPropertyProps<T> {
  readonly description: PropertyDescription;
  readonly property: PropertyCommon<T>;
  readonly targetIds: readonly string[];
  readonly equals?: ((first: T, second: T) => boolean) | undefined;
  readonly children: (props: PropertyEditorProps<T>) => ReactNode;
}

function ignoreChange(): void {}

function BoundProperty<T>({
  description,
  property,
  targetIds,
  equals = samePropertyValue,
  children,
}: BoundPropertyProps<T>) {
  const translate = useTranslate();
  const binding = useTargetsValue({ access: property, targetIds, label: property.label, equals });
  const row = usePropertyRowSlots({
    description,
    property,
    targetIds,
    values: binding?.values ?? [],
    equals,
    onValueChange: binding?.onValueChange ?? ignoreChange,
  });

  if (binding === null) {
    return null;
  }

  return children({
    ...binding,
    label: translate(property.label),
    readOnly: property.readOnly ?? false,
    row,
  });
}

function editorOf(property: PropertyDescription, targetIds: readonly string[]): ReactNode {
  const bound = { targetIds, description: property };

  switch (property.type) {
    case 'number':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <NumberEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'string':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <StringEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'boolean':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <BooleanEditor {...props} />}
        </BoundProperty>
      );
    case 'vector':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <VectorEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'color':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <ColorEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'enum':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <EnumEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'flags':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <FlagsEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'rect':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <RectEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'bounds':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <BoundsEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'reference':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <ReferenceEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'list':
      return (
        <BoundProperty {...bound} property={property}>
          {(props) => <ListPropertyEditor spec={property} {...props} />}
        </BoundProperty>
      );
    case 'custom':
      return (
        <BoundProperty
          {...bound}
          property={property}
          equals={(first, second) => property.valueType.equals(first, second)}
        >
          {(props) => <CustomEditor valueType={property.valueType} {...props} />}
        </BoundProperty>
      );
  }
}

export function PropertyField({ property, targetIds }: PropertyFieldProps) {
  return property.hidden === true ? null : editorOf(property, targetIds);
}
