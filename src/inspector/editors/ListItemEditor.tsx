import type { ItemAccess, ListItem, PropertyEditorProps } from '@/contracts/property';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { BooleanEditor } from './BooleanEditor';
import { BoundsEditor } from './BoundsEditor';
import { ColorEditor } from './ColorEditor';
import { CustomEditor } from './CustomEditor';
import { EnumEditor } from './EnumEditor';
import { FlagsEditor } from './FlagsEditor';
import { NumberEditor } from './NumberEditor';
import { RectEditor } from './RectEditor';
import { StringEditor } from './StringEditor';
import { VectorEditor } from './VectorEditor';

interface ListItemEditorProps {
  readonly item: ListItem<unknown>;
  readonly element: unknown;
  readonly label: string;
  readonly readOnly: boolean;
  readonly onElementChange: ValueChangeHandler<unknown>;
}

function itemEditorProps<V>(
  access: ItemAccess<unknown, V>,
  { element, label, readOnly, onElementChange }: Omit<ListItemEditorProps, 'item'>,
): PropertyEditorProps<V> {
  const value = access.read(element);
  const onValueChange: ValueChangeHandler<V> = (next, phase) => {
    onElementChange(access.write(element, next), phase);
  };

  return {
    label,
    value,
    values: [value],
    mixed: false,
    readOnly,
    onValueChange,
    onTargetsChange: (change, phase) => {
      onValueChange(change(value, value), phase);
    },
  };
}

export function ListItemEditor({ item, ...props }: ListItemEditorProps) {
  switch (item.type) {
    case 'number':
      return <NumberEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'string':
      return <StringEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'boolean':
      return <BooleanEditor {...itemEditorProps(item, props)} />;
    case 'vector':
      return <VectorEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'color':
      return <ColorEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'enum':
      return <EnumEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'flags':
      return <FlagsEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'rect':
      return <RectEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'bounds':
      return <BoundsEditor spec={item} {...itemEditorProps(item, props)} />;
    case 'custom':
      return <CustomEditor valueType={item.valueType} {...itemEditorProps(item, props)} />;
  }
}
