import { useState } from 'react';
import { createStore } from 'zustand/vanilla';
import type { InspectorSectionProps, InspectorSource } from '@/contracts/inspector';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { numberProperty } from '@/core/inspector/properties';
import { Inspector } from '@/inspector/Inspector';
import { InspectorItems } from '@/inspector/InspectorItems';
import { InspectorSectionFrame } from '@/inspector/InspectorSectionFrame';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Button } from '@/ui/button/Button';
import styles from './CustomSectionExample.module.css';

const spawnerMessages = defineMessages({
  en: { spawner: 'Spawner', count: 'Count', spawnNow: 'Spawn now' },
  ru: { spawner: 'Spawner', count: 'Количество', spawnNow: 'Создать сейчас' },
});

const SPAWNER_ID = 'spawner';

function createSpawner() {
  const counts = createStore<Readonly<Record<string, number>>>(() => ({ [SPAWNER_ID]: 3 }));
  const count = numberProperty({
    id: 'count',
    label: messageRef(spawnerMessages, 'count'),
    kind: 'integer',
    min: 1,
    read: (id) => counts.getState()[id] ?? 1,
    write: (id, value) => {
      counts.setState((current) => ({ ...current, [id]: value }));
    },
  });
  const source: InspectorSource = {
    getSections: () => [
      {
        id: 'spawner',
        type: 'example.spawner',
        title: messageRef(spawnerMessages, 'spawner'),
        items: [count],
      },
    ],
    subscribe: (listener) => counts.subscribe(listener),
  };
  const registries = createEditorRegistries();

  registries.inspectorSections.register({ type: 'example.spawner', component: SpawnerSection });

  return { registries, source };
}

function SpawnerSection(props: InspectorSectionProps) {
  const t = useMessages(spawnerMessages);
  const { section, targetIds } = props;

  return (
    <InspectorSectionFrame {...props}>
      <InspectorItems items={section.items} targetIds={targetIds} />
      <Button className={styles.action}>{t('spawnNow')}</Button>
    </InspectorSectionFrame>
  );
}

const SELECTED_SPAWNER = [SPAWNER_ID];

export function CustomSectionExample() {
  const [spawner] = useState(createSpawner);

  return (
    <RegistriesProvider registries={spawner.registries}>
      <div className={styles.root}>
        <Inspector source={spawner.source} targetIds={SELECTED_SPAWNER} />
      </div>
    </RegistriesProvider>
  );
}
