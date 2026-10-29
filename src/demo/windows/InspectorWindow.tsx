import { messageRef } from '@/core/i18n/translate';
import { useDemoStores, useScene } from '@/demo/demoStores';
import { demoMessages } from '@/demo/demoMessages';
import { selectedObject } from '@/demo/scene/sceneStore';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Select } from '@/ui/select/Select';
import { TextField } from '@/ui/textField/TextField';
import styles from './inspector/Inspector.module.css';
import { LightSection } from './inspector/LightSection';
import { RigidbodySection } from './inspector/RigidbodySection';
import { TransformSection } from './inspector/TransformSection';
import { useObjectProperty } from './inspector/useObjectProperty';

interface ObjectInspectorProps {
  readonly object: SceneObject;
}

function ObjectInspector({ object }: ObjectInspectorProps) {
  const t = useMessages(demoMessages);
  const changeName = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'name'),
    get: (current) => current.name,
    set: (current, name: string) => ({ ...current, name }),
  });

  return (
    <>
      <PropertyRowGroup>
        <PropertyRow label={t('name')}>
          {({ id }) => <TextField id={id} value={object.name} onValueChange={changeName} />}
        </PropertyRow>
      </PropertyRowGroup>
      <TransformSection object={object} />
      {object.rigidbody !== null && (
        <RigidbodySection object={object} rigidbody={object.rigidbody} />
      )}
      {object.light !== null && <LightSection object={object} light={object.light} />}
    </>
  );
}

export function InspectorWindow() {
  const { scene } = useDemoStores();
  const t = useMessages(demoMessages);
  const objects = useScene((state) => state.objects);
  const selected = useScene(selectedObject);

  return (
    <div className={styles.root}>
      <Select
        aria-label={t('inspectedObject')}
        placeholder={t('selectObject')}
        options={objects.map(({ id, name }) => ({ kind: 'option', value: id, label: name }))}
        value={selected?.id ?? null}
        onValueChange={(id) => {
          scene.getState().select(id);
        }}
      />
      {selected !== null && <ObjectInspector key={selected.id} object={selected} />}
    </div>
  );
}
