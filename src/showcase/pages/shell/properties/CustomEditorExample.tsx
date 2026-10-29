import { useState } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import type { PropertyEditorProps } from '@/contracts/property';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { customProperty, definePropertyType } from '@/core/inspector/properties';
import { PropertyField } from '@/inspector/PropertyField';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Select } from '@/ui/select/Select';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import styles from './CustomEditorExample.module.css';

const layerMessages = defineMessages({
  en: { layer: 'Layer' },
  ru: { layer: 'Слой' },
});

const ENGINE_LAYERS = ['Default', 'Water', 'UI', 'Player'];
const SELECTED_OBJECT = ['player'];

const layerType = definePropertyType<number>({ id: 'example.layer' });

function LayerEditor({
  label,
  value,
  mixed,
  readOnly,
  onValueChange,
}: PropertyEditorProps<number>) {
  const options = ENGINE_LAYERS.map((name, index) => ({
    kind: 'option' as const,
    value: String(index),
    label: name,
  }));

  return (
    <PropertyRow label={label}>
      {({ id, labelId }) => (
        <Select
          id={id}
          aria-labelledby={labelId}
          options={options}
          value={mixed ? null : String(value)}
          placeholder={MIXED_VALUE_PLACEHOLDER}
          disabled={readOnly}
          onValueChange={(next) => {
            onValueChange(Number(next), 'commit');
          }}
        />
      )}
    </PropertyRow>
  );
}

function createScene() {
  const registries = createEditorRegistries();
  const layers = createStore<Readonly<Record<string, number>>>(() => ({ player: 3 }));

  registries.propertyEditors.register(layerType, LayerEditor);

  const layer = customProperty({
    id: 'layer',
    label: messageRef(layerMessages, 'layer'),
    valueType: layerType,
    read: (id) => layers.getState()[id] ?? 0,
    write: (id, index) => {
      layers.setState((current) => ({ ...current, [id]: index }));
    },
  });

  return { registries, layers, layer };
}

export function CustomEditorExample() {
  const [scene] = useState(createScene);

  useStore(scene.layers);

  return (
    <RegistriesProvider registries={scene.registries}>
      <PropertyRowGroup className={styles.group}>
        <PropertyField property={scene.layer} targetIds={SELECTED_OBJECT} />
      </PropertyRowGroup>
    </RegistriesProvider>
  );
}
