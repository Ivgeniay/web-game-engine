import { useMemo, useState } from 'react';
import type { ReferenceSpec } from '@/contracts/property';
import { pickerDialogMessages } from '@/state/fields/pickerDialogMessages';
import { usePickerDialogLabels } from '@/state/fields/usePickerDialogLabels';
import { useReferenceFieldLabels } from '@/state/fields/useReferenceFieldLabels';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { PickerDialog } from '@/ui/pickerDialog/PickerDialog';
import type { PickerTab } from '@/ui/pickerDialog/PickerDialog';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { ReferenceField } from '@/ui/referenceField/ReferenceField';
import type { BuiltInEditorProps } from './builtInEditorProps';

export function ReferenceEditor({
  spec,
  label,
  value,
  mixed,
  readOnly,
  row,
  onValueChange,
}: BuiltInEditorProps<string | null, ReferenceSpec>) {
  const { provider } = spec;
  const t = useMessages(pickerDialogMessages);
  const translate = useTranslate();
  const fieldLabels = useReferenceFieldLabels();
  const pickerLabels = usePickerDialogLabels();
  const [pickerOpen, setPickerOpen] = useState(false);
  const tabs = useMemo<readonly PickerTab[]>(
    () =>
      provider.tabs.map((tab) => ({
        id: tab.id,
        label: translate(tab.label),
        getItemIds: tab.getItemIds,
      })),
    [provider.tabs, translate],
  );

  return (
    <PropertyRow label={label} {...row}>
      {({ id, labelId }) => (
        <>
          <ReferenceField
            id={id}
            aria-labelledby={labelId}
            value={mixed ? null : value}
            mixed={mixed}
            readOnly={readOnly}
            getLabel={provider.getLabel}
            getIcon={provider.getIcon}
            labels={fieldLabels}
            dropTypes={provider.dragTypes}
            resolveDrop={provider.resolveDrop}
            onValueChange={onValueChange}
            onOpenPicker={() => {
              setPickerOpen(true);
            }}
          />
          <PickerDialog
            open={pickerOpen}
            title={t('pickerTitle', { property: label })}
            value={mixed ? null : value}
            tabs={tabs}
            getLabel={provider.getLabel}
            getIcon={provider.getIcon}
            loadThumbnail={provider.loadThumbnail}
            labels={pickerLabels}
            onValueChange={onValueChange}
            onClose={() => {
              setPickerOpen(false);
            }}
          />
        </>
      )}
    </PropertyRow>
  );
}
