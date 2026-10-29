import { useMemo, useState } from 'react';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { applySceneEdit, renameObject } from '@/demo/scene/sceneEdits';
import type { SceneEdit } from '@/demo/scene/sceneEdits';
import {
  createSceneTreeModel,
  deleteObjects,
  duplicateObjects,
  moveObjects,
} from '@/demo/scene/sceneHierarchy';
import { ContextMenu } from '@/shell/ContextMenu';
import { useContextMenu } from '@/shell/useContextMenu';
import { useMessages } from '@/state/language/useMessages';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useRegistration } from '@/state/registries/useRegistration';
import { TreeView } from '@/ui/treeView/TreeView';
import {
  deleteObjectCommand,
  duplicateObjectCommand,
  hierarchyObjectMenu,
  renameObjectCommand,
} from './demoWindowCommands';
import styles from './DemoWindow.module.css';

const SCENE_OBJECT_DRAG_TYPE = 'demo.scene-object';

export function HierarchyWindow() {
  const { scene } = useDemoStores();
  const { undo } = useEditorRegistries();
  const t = useMessages(demoMessages);
  const objects = useScene((state) => state.objects);
  const selectedIds = useScene((state) => state.selectedIds);
  const model = useMemo(() => createSceneTreeModel(objects), [objects]);
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(() =>
    scene.getState().objects.flatMap(({ parentId }) => (parentId === null ? [] : [parentId])),
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const objectMenu = useContextMenu(hierarchyObjectMenu);

  useRegistration(
    ({ commands, undo }) => {
      const hasSelection = () => scene.getState().selectedIds.length > 0;

      return combineUnsubscribes(
        commands.handle(renameObjectCommand, {
          run: () => {
            const { selectedIds: selected } = scene.getState();
            setRenamingId((current) => current ?? selected[0] ?? null);
          },
          isEnabled: hasSelection,
        }),
        commands.handle(duplicateObjectCommand, {
          run: () => {
            applySceneEdit(scene, undo, duplicateObjectCommand.label, (snapshot) =>
              duplicateObjects(snapshot, snapshot.selectedIds, scene.getState().createId),
            );
          },
          isEnabled: hasSelection,
        }),
        commands.handle(deleteObjectCommand, {
          run: () => {
            applySceneEdit(scene, undo, deleteObjectCommand.label, (snapshot) =>
              deleteObjects(snapshot, snapshot.selectedIds),
            );
          },
          isEnabled: hasSelection,
        }),
      );
    },
    [scene],
  );

  function edit(label: MessageRef, change: SceneEdit): void {
    applySceneEdit(scene, undo, label, change);
  }

  return (
    <div className={styles.fill} {...objectMenu.getTriggerProps(selectedIds)}>
      <TreeView
        aria-label={t('hierarchy')}
        className={styles.tree}
        model={model}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectedIdsChange={(ids) => {
          scene.getState().setSelection(ids);
        }}
        focusedId={focusedId}
        onFocusedIdChange={setFocusedId}
        expandedIds={expandedIds}
        onExpandedIdsChange={setExpandedIds}
        renamingId={renamingId}
        onRenamingIdChange={setRenamingId}
        renameLabel={t('objectName')}
        validateName={(name) => (name.trim() === '' ? t('emptyName') : undefined)}
        onRename={(id, name) => {
          edit(renameObjectCommand.label, renameObject(id, name));
        }}
        dragType={SCENE_OBJECT_DRAG_TYPE}
        onDropData={({ ids }, target) => {
          edit(messageRef(demoMessages, 'moveObjects'), (snapshot) =>
            moveObjects(snapshot, ids, target),
          );
        }}
      />
      <ContextMenu
        context={hierarchyObjectMenu}
        request={objectMenu.request}
        onClose={objectMenu.close}
      />
    </div>
  );
}
