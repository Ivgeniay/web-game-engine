import { useState, useSyncExternalStore } from 'react';
import { createStore } from 'zustand/vanilla';
import type { InspectorSection, InspectorSource } from '@/contracts/inspector';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { booleanProperty, numberProperty } from '@/core/inspector/properties';
import { Inspector } from '@/inspector/Inspector';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Button } from '@/ui/button/Button';
import styles from './InspectorExample.module.css';

const lampMessages = defineMessages({
  en: {
    light: 'Light',
    intensity: 'Intensity',
    range: 'Range',
    shadows: 'Shadows',
    castShadows: 'Cast shadows',
    undo: 'Undo',
  },
  ru: {
    light: 'Light',
    intensity: 'Интенсивность',
    range: 'Дальность',
    shadows: 'Тени',
    castShadows: 'Отбрасывать тени',
    undo: 'Отменить',
  },
});

interface Lamp {
  readonly enabled: boolean;
  readonly intensity: number;
  readonly range: number;
  readonly castShadows: boolean;
}

const DEFAULT_LAMP: Lamp = { enabled: true, intensity: 1, range: 10, castShadows: false };
const SELECTED_LAMPS = ['hall', 'porch'];

function createLamps() {
  const store = createStore<Readonly<Record<string, Lamp>>>(() => ({
    hall: { ...DEFAULT_LAMP, intensity: 2 },
    porch: { ...DEFAULT_LAMP, enabled: false },
  }));
  const read = (id: string) => store.getState()[id] ?? DEFAULT_LAMP;
  const update = (id: string, patch: Partial<Lamp>) => {
    store.setState((lamps) => ({ ...lamps, [id]: { ...read(id), ...patch } }));
  };

  const light: InspectorSection = {
    id: 'light',
    type: 'example.light',
    title: messageRef(lampMessages, 'light'),
    enabled: {
      read: (id) => read(id).enabled,
      write: (id, enabled) => {
        update(id, { enabled });
      },
    },
    items: [
      numberProperty({
        id: 'intensity',
        label: messageRef(lampMessages, 'intensity'),
        slider: true,
        min: 0,
        max: 8,
        defaultValue: DEFAULT_LAMP.intensity,
        read: (id) => read(id).intensity,
        write: (id, intensity) => {
          update(id, { intensity });
        },
      }),
      numberProperty({
        id: 'range',
        label: messageRef(lampMessages, 'range'),
        min: 0,
        defaultValue: DEFAULT_LAMP.range,
        read: (id) => read(id).range,
        write: (id, range) => {
          update(id, { range });
        },
      }),
      {
        type: 'group',
        id: 'shadows',
        label: messageRef(lampMessages, 'shadows'),
        properties: [
          booleanProperty({
            id: 'castShadows',
            label: messageRef(lampMessages, 'castShadows'),
            defaultValue: DEFAULT_LAMP.castShadows,
            read: (id) => read(id).castShadows,
            write: (id, castShadows) => {
              update(id, { castShadows });
            },
          }),
        ],
      },
    ],
  };

  const source: InspectorSource = {
    getSections: () => [light],
    subscribe: (listener) => store.subscribe(listener),
  };

  return source;
}

export function InspectorExample() {
  const t = useMessages(lampMessages);
  const [registries] = useState(createEditorRegistries);
  const [source] = useState(createLamps);
  const { undo } = registries;
  const canUndo = useSyncExternalStore(undo.subscribe, undo.canUndo);

  return (
    <RegistriesProvider registries={registries}>
      <div className={styles.root}>
        <div className={styles.inspector}>
          <Inspector source={source} targetIds={SELECTED_LAMPS} />
        </div>
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
