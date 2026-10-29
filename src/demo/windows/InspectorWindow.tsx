import { useState } from 'react';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import {
  REMOVABLE_COMPONENTS,
  removeComponent,
  resetComponent,
} from '@/demo/scene/sceneComponents';
import { applySceneEdit } from '@/demo/scene/sceneEdits';
import { Inspector } from '@/inspector/Inspector';
import { PropertyField } from '@/inspector/PropertyField';
import { useMessages } from '@/state/language/useMessages';
import { useRegistration } from '@/state/registries/useRegistration';
import { Label } from '@/ui/label/Label';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { removeComponentCommand, resetComponentCommand } from './demoWindowCommands';
import styles from './inspector/Inspector.module.css';
import {
  componentOfSection,
  createDemoInspectorSource,
  createNameProperty,
} from './inspector/demoInspectorSource';

export function InspectorWindow() {
  const { scene } = useDemoStores();
  const t = useMessages(demoMessages);
  const selectedIds = useScene((state) => state.selectedIds);
  const [source] = useState(() => createDemoInspectorSource(scene));
  const [nameProperty] = useState(() => createNameProperty(scene));

  useScene((state) => state.objects);

  useRegistration(
    ({ commands, undo }) =>
      combineUnsubscribes(
        commands.handle(resetComponentCommand, {
          run: ({ target }) => {
            const component = componentOfSection(target.section);

            if (component !== undefined) {
              applySceneEdit(scene, undo, resetComponentCommand.label, (snapshot) =>
                resetComponent(snapshot, target.targetIds, component),
              );
            }
          },
        }),
        commands.handle(removeComponentCommand, {
          run: ({ target }) => {
            const component = componentOfSection(target.section);

            if (component !== undefined) {
              applySceneEdit(scene, undo, removeComponentCommand.label, (snapshot) =>
                removeComponent(snapshot, target.targetIds, component),
              );
            }
          },
          isEnabled: ({ target }) => {
            const component = componentOfSection(target.section);

            return component !== undefined && REMOVABLE_COMPONENTS.has(component);
          },
        }),
      ),
    [scene],
  );

  return (
    <div className={styles.root}>
      {selectedIds.length === 0 ? (
        <Label tone="secondary">{t('selectObject')}</Label>
      ) : (
        <>
          <PropertyRowGroup>
            <PropertyField property={nameProperty} targetIds={selectedIds} />
          </PropertyRowGroup>
          <Inspector source={source} targetIds={selectedIds} />
        </>
      )}
    </div>
  );
}
