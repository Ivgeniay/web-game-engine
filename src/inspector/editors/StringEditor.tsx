import type { StringSpec } from '@/contracts/property';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { TextArea } from '@/ui/textArea/TextArea';
import { TextField } from '@/ui/textField/TextField';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function StringEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  row,
  onValueChange,
}: BuiltInEditorProps<string, StringSpec>) {
  return (
    <PropertyRow label={label} {...row}>
      {({ id }) =>
        spec.multiline === true ? (
          <TextArea
            id={id}
            value={value}
            mixed={mixed}
            readOnly={readOnly}
            onValueChange={onValueChange}
          />
        ) : (
          <TextField
            id={id}
            value={value}
            mixed={mixed}
            readOnly={readOnly}
            onValueChange={onValueChange}
          />
        )
      }
    </PropertyRow>
  );
}
