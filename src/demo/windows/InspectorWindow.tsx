import { useMemo, useState } from 'react';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import {
  REMOVABLE_COMPONENTS,
  hasComponent,
  removeComponent,
  resetComponent,
} from '@/demo/scene/sceneComponents';
import type { ComponentKind } from '@/demo/scene/sceneComponents';
import { applySceneEdit } from '@/demo/scene/sceneEdits';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { useRegistration } from '@/state/registries/useRegistration';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { TextField } from '@/ui/textField/TextField';
import { removeComponentCommand, resetComponentCommand } from './demoWindowCommands';
import styles from './inspector/Inspector.module.css';
import { LightSection } from './inspector/LightSection';
import { RigidbodySection } from './inspector/RigidbodySection';
import { TransformSection } from './inspector/TransformSection';
import { useSelectionProperty } from './inspector/useSelectionProperty';

type ExpandedComponents = Readonly<Record<ComponentKind, boolean>>;

const ALL_EXPANDED: ExpandedComponents = { transform: true, rigidbody: true, light: true };

interface ObjectsInspectorProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: ExpandedComponents;
  readonly onExpandedChange: (component: ComponentKind, expanded: boolean) => void;
}

function ObjectsInspector({ objects, expanded, onExpandedChange }: ObjectsInspectorProps) {
  const t = useMessages(demoMessages);
  const name = useSelectionProperty({
    objects,
    label: messageRef(demoMessages, 'name'),
    get: (object) => object.name,
    set: (object, value) => ({ ...object, name: value }),
  });
  const shared = (component: ComponentKind) =>
    objects.every((object) => hasComponent(object, component));
  const sectionProps = (component: ComponentKind) => ({
    objects,
    expanded: expanded[component],
    onExpandedChange: (next: boolean) => {
      onExpandedChange(component, next);
    },
  });

  return (
    <>
      <PropertyRowGroup>
        <PropertyRow label={t('name')}>
          {({ id }) => (
            <TextField
              id={id}
              value={name.value}
              mixed={name.mixed}
              onValueChange={name.onValueChange}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      <TransformSection {...sectionProps('transform')} />
      {shared('rigidbody') && <RigidbodySection {...sectionProps('rigidbody')} />}
      {shared('light') && <LightSection {...sectionProps('light')} />}
    </>
  );
}

export function InspectorWindow() {
  const { scene } = useDemoStores();
  const t = useMessages(demoMessages);
  const objects = useScene((state) => state.objects);
  const selectedIds = useScene((state) => state.selectedIds);
  const [expanded, setExpanded] = useState(ALL_EXPANDED);
  const selected = useMemo(() => {
    const ids = new Set(selectedIds);

    return objects.filter(({ id }) => ids.has(id));
  }, [objects, selectedIds]);

  useRegistration(
    ({ commands, undo }) =>
      combineUnsubscribes(
        commands.handle(resetComponentCommand, {
          run: ({ target }) => {
            applySceneEdit(scene, undo, resetComponentCommand.label, (snapshot) =>
              resetComponent(snapshot, snapshot.selectedIds, target.component),
            );
          },
        }),
        commands.handle(removeComponentCommand, {
          run: ({ target }) => {
            applySceneEdit(scene, undo, removeComponentCommand.label, (snapshot) =>
              removeComponent(snapshot, snapshot.selectedIds, target.component),
            );
          },
          isEnabled: ({ target }) => REMOVABLE_COMPONENTS.has(target.component),
        }),
      ),
    [scene],
  );

  return (
    <div className={styles.root}>
      {selected.length === 0 ? (
        <Label tone="secondary">{t('selectObject')}</Label>
      ) : (
        <ObjectsInspector
          key={selectedIds.join(' ')}
          objects={selected}
          expanded={expanded}
          onExpandedChange={(component, next) => {
            setExpanded((current) => ({ ...current, [component]: next }));
          }}
        />
      )}
    </div>
  );
}
