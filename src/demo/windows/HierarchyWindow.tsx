import type { MouseEvent } from 'react';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { selectedObject } from '@/demo/scene/sceneStore';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { ContextMenu } from '@/shell/ContextMenu';
import { useContextMenu } from '@/shell/useContextMenu';
import { useMessages } from '@/state/language/useMessages';
import { useRegistration } from '@/state/registries/useRegistration';
import {
  deleteObjectCommand,
  duplicateObjectCommand,
  hierarchyObjectMenu,
} from './demoWindowCommands';
import styles from './DemoWindow.module.css';

export function HierarchyWindow() {
  const { scene } = useDemoStores();
  const t = useMessages(demoMessages);
  const objects = useScene((state) => state.objects);
  const selectedId = useScene((state) => state.selectedId);
  const objectMenu = useContextMenu(hierarchyObjectMenu);

  useRegistration(
    ({ commands }) => {
      const hasSelection = () => selectedObject(scene.getState()) !== null;

      return combineUnsubscribes(
        commands.handle(duplicateObjectCommand, {
          run: () => {
            scene.getState().duplicateSelected();
          },
          isEnabled: hasSelection,
        }),
        commands.handle(deleteObjectCommand, {
          run: () => {
            scene.getState().deleteSelected();
          },
          isEnabled: hasSelection,
        }),
      );
    },
    [scene],
  );

  function rowProps(object: SceneObject) {
    const triggerProps = objectMenu.getTriggerProps(object);

    return {
      ...triggerProps,
      onClick: () => {
        scene.getState().select(object.id);
      },
      onContextMenu: (event: MouseEvent<HTMLElement>) => {
        scene.getState().select(object.id);
        triggerProps.onContextMenu(event);
      },
    };
  }

  return (
    <div className={styles.list} aria-label={t('hierarchy')} role="group">
      {objects.map((object) => (
        <button
          key={object.id}
          type="button"
          className={styles.row}
          aria-current={object.id === selectedId}
          {...rowProps(object)}
        >
          {object.name}
        </button>
      ))}
      <ContextMenu
        context={hierarchyObjectMenu}
        request={objectMenu.request}
        onClose={objectMenu.close}
      />
    </div>
  );
}
