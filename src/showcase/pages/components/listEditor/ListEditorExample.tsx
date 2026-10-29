import { useState } from 'react';
import { useListEditorLabels } from '@/state/fields/useListEditorLabels';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Label } from '@/ui/label/Label';
import { ListEditor } from '@/ui/listEditor/ListEditor';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './ListEditorExample.module.css';

const WAYPOINTS_LABEL = 'Waypoints';
const COMMITS_CAPTION = 'Commits:';
const ORIGIN: readonly number[] = [0, 0, 0];

export function ListEditorExample() {
  const labels = useListEditorLabels();
  const invalidMessages = useNumberFieldMessages();
  const [expanded, setExpanded] = useState(true);
  const [commits, setCommits] = useState(0);
  const [waypoints, setWaypoints] = useState<readonly (readonly number[])[]>([
    [0, 0, 0],
    [4, 0, 2],
    [8, 1, 0],
  ]);

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.rows}>
        <ListEditor
          label={WAYPOINTS_LABEL}
          value={waypoints}
          expanded={expanded}
          onExpandedChange={setExpanded}
          labels={labels}
          createItem={() => ORIGIN}
          renderItem={({ item, label, disabled, onItemChange }) => (
            <PropertyRow label={label} disabled={disabled}>
              {({ id, labelId }) => (
                <VectorField
                  id={id}
                  aria-labelledby={labelId}
                  axes={VECTOR3_AXES}
                  value={item}
                  disabled={disabled}
                  invalidMessages={invalidMessages}
                  onValueChange={onItemChange}
                />
              )}
            </PropertyRow>
          )}
          onValueChange={(next, phase) => {
            setWaypoints(next);

            if (phase === 'commit') {
              setCommits((count) => count + 1);
            }
          }}
        />
      </PropertyRowGroup>
      <Label tone="secondary">{`${COMMITS_CAPTION} ${String(commits)}`}</Label>
    </div>
  );
}
