import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { addComponent, hasComponent } from '@/demo/scene/sceneComponents';
import type { ComponentKind } from '@/demo/scene/sceneComponents';
import { applySceneEdit } from '@/demo/scene/sceneEdits';
import { useSearchableMenuLabels } from '@/state/fields/useSearchableMenuLabels';
import { useTranslate } from '@/state/language/useTranslate';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Button } from '@/ui/button/Button';
import { SearchableMenu } from '@/ui/searchableMenu/SearchableMenu';
import type { SearchableMenuItem } from '@/ui/searchableMenu/searchableMenuModel';
import styles from './Inspector.module.css';

interface ComponentCategory {
  readonly id: string;
  readonly label: MessageRef;
  readonly components: readonly ComponentKind[];
}

const COMPONENT_CATEGORIES: readonly ComponentCategory[] = [
  {
    id: 'rendering',
    label: messageRef(demoMessages, 'categoryRendering'),
    components: ['meshRenderer', 'light'],
  },
  { id: 'physics', label: messageRef(demoMessages, 'categoryPhysics'), components: ['rigidbody'] },
  { id: 'navigation', label: messageRef(demoMessages, 'categoryNavigation'), components: ['path'] },
  {
    id: 'miscellaneous',
    label: messageRef(demoMessages, 'categoryMiscellaneous'),
    components: ['note'],
  },
];

const ADD_COMPONENT_LABEL = messageRef(demoMessages, 'addComponent');

function isComponentKind(id: string): id is ComponentKind {
  return COMPONENT_CATEGORIES.some(({ components }) =>
    components.some((component) => component === id),
  );
}

export function AddComponentButton() {
  const { scene } = useDemoStores();
  const { undo } = useEditorRegistries();
  const translate = useTranslate();
  const labels = useSearchableMenuLabels();
  const objects = useScene((state) => state.objects);
  const selectedIds = useScene((state) => state.selectedIds);
  const selected = objects.filter(({ id }) => selectedIds.includes(id));
  const items: readonly SearchableMenuItem[] = COMPONENT_CATEGORIES.map((category) => ({
    id: category.id,
    label: translate(category.label),
    children: category.components.map((component) => ({
      id: component,
      label: translate(messageRef(demoMessages, component)),
      disabled: selected.every((object) => hasComponent(object, component)),
    })),
  }));

  return (
    <SearchableMenu
      label={translate(ADD_COMPONENT_LABEL)}
      items={items}
      labels={labels}
      onSelect={(id) => {
        if (isComponentKind(id)) {
          applySceneEdit(scene, undo, ADD_COMPONENT_LABEL, (snapshot) =>
            addComponent(snapshot, snapshot.selectedIds, id),
          );
        }
      }}
      trigger={(triggerProps) => (
        <Button {...triggerProps} className={styles.addComponent}>
          {translate(ADD_COMPONENT_LABEL)}
        </Button>
      )}
    />
  );
}
