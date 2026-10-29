import { useState } from 'react';
import type { ListSpec } from '@/contracts/property';
import { useListEditorLabels } from '@/state/fields/useListEditorLabels';
import { ListEditor } from '@/ui/listEditor/ListEditor';
import type { BuiltInEditorProps } from './builtInEditorProps';
import { ListItemEditor } from './ListItemEditor';

export function ListPropertyEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  onValueChange,
}: BuiltInEditorProps<readonly unknown[], ListSpec>) {
  const labels = useListEditorLabels();
  const [expanded, setExpanded] = useState(true);

  return (
    <ListEditor
      label={label}
      value={value}
      mixed={mixed}
      disabled={readOnly}
      expanded={expanded}
      onExpandedChange={setExpanded}
      labels={labels}
      createItem={() => spec.createItem()}
      copyItem={(item) => (spec.copyItem === undefined ? item : spec.copyItem(item))}
      getItemKey={(item, index) =>
        spec.getItemKey === undefined ? String(index) : spec.getItemKey(item, index)
      }
      renderItem={({ item, label: itemLabel, disabled, onItemChange }) => (
        <ListItemEditor
          item={spec.item}
          element={item}
          label={itemLabel}
          readOnly={disabled}
          onElementChange={onItemChange}
        />
      )}
      onValueChange={onValueChange}
    />
  );
}
