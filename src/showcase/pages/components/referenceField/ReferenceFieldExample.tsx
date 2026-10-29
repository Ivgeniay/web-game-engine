import { useState } from 'react';
import type { DragData } from '@/contracts/dragData';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { usePickerDialogLabels } from '@/state/fields/usePickerDialogLabels';
import { useReferenceFieldLabels } from '@/state/fields/useReferenceFieldLabels';
import { useDragSource } from '@/ui/dragAndDrop/useDragSource';
import { Label } from '@/ui/label/Label';
import { PickerDialog } from '@/ui/pickerDialog/PickerDialog';
import type { PickerTab } from '@/ui/pickerDialog/PickerDialog';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { ReferenceField } from '@/ui/referenceField/ReferenceField';
import styles from './ReferenceFieldExample.module.css';

const MATERIAL_LABEL = 'Material';
const PICKER_TITLE = 'Select Material';
const DRAG_HINT = 'Drag me onto the field:';
const MATERIAL_DRAG_TYPE = 'example.material';
const DRAGGED_MATERIAL = 'brick';

const MATERIALS: Readonly<Record<string, string>> = {
  ground: 'Ground',
  rock: 'Rock',
  brick: 'Brick',
  water: 'Water',
};

const TABS: readonly PickerTab[] = [
  { id: 'assets', label: 'Assets', getItemIds: () => Object.keys(MATERIALS) },
];

function materialName(id: string): string {
  return MATERIALS[id] ?? id;
}

function resolveMaterial(data: DragData): string | null {
  const [id] = data.ids;

  return id !== undefined && id in MATERIALS ? id : null;
}

function DraggableMaterial() {
  const { startDrag } = useDragSource();

  return (
    <span
      className={styles.chip}
      onPointerDown={(event) => {
        startDrag(event, () => ({
          type: MATERIAL_DRAG_TYPE,
          ids: [DRAGGED_MATERIAL],
          label: materialName(DRAGGED_MATERIAL),
        }));
      }}
    >
      {materialName(DRAGGED_MATERIAL)}
    </span>
  );
}

export function ReferenceFieldExample() {
  const fieldLabels = useReferenceFieldLabels();
  const pickerLabels = usePickerDialogLabels();
  const [material, setMaterial] = useState<string | null>('rock');
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.group}>
        <PropertyRow label={MATERIAL_LABEL}>
          {({ id, labelId }) => (
            <ReferenceField
              id={id}
              aria-labelledby={labelId}
              value={material}
              getLabel={materialName}
              getIcon={() => frameworkIcons.file}
              labels={fieldLabels}
              dropTypes={[MATERIAL_DRAG_TYPE]}
              resolveDrop={resolveMaterial}
              onValueChange={setMaterial}
              onOpenPicker={() => {
                setPickerOpen(true);
              }}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      <div className={styles.source}>
        <Label tone="secondary">{DRAG_HINT}</Label>
        <DraggableMaterial />
      </div>
      <PickerDialog
        open={pickerOpen}
        title={PICKER_TITLE}
        value={material}
        tabs={TABS}
        getLabel={materialName}
        getIcon={() => frameworkIcons.file}
        labels={pickerLabels}
        onValueChange={setMaterial}
        onClose={() => {
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
