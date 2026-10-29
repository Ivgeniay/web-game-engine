import { useState } from 'react';
import { messageRef } from '@/core/i18n/translate';
import { sameValue } from '@/core/undo/undoableValue';
import { useDemoStores } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { DEFAULT_PATH } from '@/demo/scene/sceneStore';
import type { Path, SceneObject, Waypoint } from '@/demo/scene/sceneStore';
import { useListEditorLabels } from '@/state/fields/useListEditorLabels';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { useMessages } from '@/state/language/useMessages';
import { ListEditor } from '@/ui/listEditor/ListEditor';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import { ComponentSection } from './ComponentSection';
import { useSelectionProperty } from './useSelectionProperty';

interface PathSectionProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

const ORIGIN: readonly number[] = [0, 0, 0];

function pathOf(object: SceneObject): Path {
  return object.path ?? DEFAULT_PATH;
}

function withWaypoints(object: SceneObject, waypoints: readonly Waypoint[]): SceneObject {
  return object.path === null ? object : { ...object, path: { ...object.path, waypoints } };
}

function sameWaypoints(first: readonly Waypoint[], second: readonly Waypoint[]): boolean {
  return (
    first.length === second.length &&
    first.every((waypoint, index) => sameValue(waypoint.position, second[index]?.position))
  );
}

export function PathSection({ objects, expanded, onExpandedChange }: PathSectionProps) {
  const t = useMessages(demoMessages);
  const { scene } = useDemoStores();
  const labels = useListEditorLabels();
  const invalidMessages = useNumberFieldMessages();
  const [listExpanded, setListExpanded] = useState(true);
  const waypoints = useSelectionProperty({
    objects,
    label: messageRef(demoMessages, 'waypoints'),
    get: (object) => pathOf(object).waypoints,
    set: withWaypoints,
    equals: sameWaypoints,
  });

  function newWaypoint(position: readonly number[]): Waypoint {
    return { id: scene.getState().createId(), position };
  }

  return (
    <ComponentSection
      component="path"
      title={t('path')}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <ListEditor
        label={t('waypoints')}
        value={waypoints.value}
        mixed={waypoints.mixed}
        expanded={listExpanded}
        onExpandedChange={setListExpanded}
        labels={labels}
        getItemKey={(waypoint) => waypoint.id}
        createItem={() => newWaypoint(ORIGIN)}
        copyItem={(waypoint) => newWaypoint(waypoint.position)}
        renderItem={({ item, label, disabled, onItemChange }) => (
          <PropertyRow label={label} disabled={disabled}>
            {({ id, labelId }) => (
              <VectorField
                id={id}
                aria-labelledby={labelId}
                axes={VECTOR3_AXES}
                value={item.position}
                disabled={disabled}
                invalidMessages={invalidMessages}
                onValueChange={(position, phase) => {
                  onItemChange({ ...item, position }, phase);
                }}
              />
            )}
          </PropertyRow>
        )}
        onValueChange={waypoints.onValueChange}
      />
    </ComponentSection>
  );
}
