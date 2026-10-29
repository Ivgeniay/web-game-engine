import { useState, useSyncExternalStore } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import type { PropertyDescription } from '@/contracts/property';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { enumProperty, numberProperty, vectorProperty } from '@/core/inspector/properties';
import { PropertyField } from '@/inspector/PropertyField';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Button } from '@/ui/button/Button';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './PropertyFieldExample.module.css';

const bodyMessages = defineMessages({
  en: {
    mass: 'Mass',
    position: 'Position',
    bodyType: 'Body type',
    dynamic: 'Dynamic',
    kinematic: 'Kinematic',
    static: 'Static',
    undo: 'Undo',
  },
  ru: {
    mass: 'Масса',
    position: 'Позиция',
    bodyType: 'Тип тела',
    dynamic: 'Динамическое',
    kinematic: 'Кинематическое',
    static: 'Статическое',
    undo: 'Отменить',
  },
});

type BodyType = 'dynamic' | 'kinematic' | 'static';

interface Body {
  readonly mass: number;
  readonly position: readonly number[];
  readonly bodyType: BodyType;
}

const DEFAULT_BODY: Body = { mass: 1, position: [0, 0, 0], bodyType: 'dynamic' };
const SELECTED_BODIES = ['crate', 'barrel'];

function createBodies() {
  const store = createStore<Readonly<Record<string, Body>>>(() => ({
    crate: { mass: 10, position: [0, 0, 0], bodyType: 'dynamic' },
    barrel: { mass: 4, position: [2, 0, 0], bodyType: 'dynamic' },
  }));
  const read = (id: string) => store.getState()[id] ?? DEFAULT_BODY;
  const update = (id: string, patch: Partial<Body>) => {
    store.setState((bodies) => ({ ...bodies, [id]: { ...read(id), ...patch } }));
  };

  const properties: readonly PropertyDescription[] = [
    numberProperty({
      id: 'mass',
      label: messageRef(bodyMessages, 'mass'),
      min: 0,
      read: (id) => read(id).mass,
      write: (id, mass) => {
        update(id, { mass });
      },
    }),
    vectorProperty({
      id: 'position',
      label: messageRef(bodyMessages, 'position'),
      dimensions: 3,
      read: (id) => read(id).position,
      write: (id, position) => {
        update(id, { position });
      },
    }),
    enumProperty({
      id: 'bodyType',
      label: messageRef(bodyMessages, 'bodyType'),
      options: [
        { value: 'dynamic', label: messageRef(bodyMessages, 'dynamic') },
        { value: 'kinematic', label: messageRef(bodyMessages, 'kinematic') },
        { value: 'static', label: messageRef(bodyMessages, 'static') },
      ],
      read: (id) => read(id).bodyType,
      write: (id, bodyType) => {
        update(id, { bodyType });
      },
    }),
  ];

  return { store, properties };
}

export function PropertyFieldExample() {
  const t = useMessages(bodyMessages);
  const [registries] = useState(createEditorRegistries);
  const [bodies] = useState(createBodies);
  const { undo } = registries;
  const canUndo = useSyncExternalStore(undo.subscribe, undo.canUndo);

  useStore(bodies.store);

  return (
    <RegistriesProvider registries={registries}>
      <div className={styles.root}>
        <PropertyRowGroup className={styles.group}>
          {bodies.properties.map((property) => (
            <PropertyField key={property.id} property={property} targetIds={SELECTED_BODIES} />
          ))}
        </PropertyRowGroup>
        <Button
          disabled={!canUndo}
          onClick={() => {
            undo.undo();
          }}
        >
          {t('undo')}
        </Button>
      </div>
    </RegistriesProvider>
  );
}
