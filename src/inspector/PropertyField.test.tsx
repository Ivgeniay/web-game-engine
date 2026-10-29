import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useSyncExternalStore } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PropertyDescription, PropertyEditorProps } from '@/contracts/property';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import {
  booleanProperty,
  customProperty,
  definePropertyType,
  enumProperty,
  flagsProperty,
  listProperty,
  numberProperty,
  vectorProperty,
} from '@/core/inspector/properties';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { PropertyField } from './PropertyField';

const messages = defineMessages({
  en: {
    mass: 'Mass',
    position: 'Position',
    mode: 'Mode',
    modeOff: 'Off',
    modeOn: 'On',
    layers: 'Layers',
    water: 'Water',
    ground: 'Ground',
    visible: 'Visible',
    waypoints: 'Waypoints',
    layer: 'Layer',
  },
  ru: {
    mass: 'Масса',
    position: 'Позиция',
    mode: 'Режим',
    modeOff: 'Выключен',
    modeOn: 'Включён',
    layers: 'Слои',
    water: 'Вода',
    ground: 'Земля',
    visible: 'Видимый',
    waypoints: 'Точки пути',
    layer: 'Слой',
  },
});

type Mode = 'off' | 'on';
type LayerFlag = 'water' | 'ground';

interface Waypoint {
  readonly id: string;
  readonly position: readonly number[];
}

interface Item {
  readonly mass: number;
  readonly position: readonly number[];
  readonly mode: Mode;
  readonly layers: readonly LayerFlag[];
  readonly visible: boolean;
  readonly waypoints: readonly Waypoint[];
  readonly layer: number;
}

const BASE_ITEM: Item = {
  mass: 1,
  position: [0, 0, 0],
  mode: 'off',
  layers: [],
  visible: true,
  waypoints: [],
  layer: 0,
};

function createItems(initial: Readonly<Record<string, Partial<Item>>>) {
  const items = new Map(
    Object.entries(initial).map(([id, item]) => [id, { ...BASE_ITEM, ...item }]),
  );
  const listeners = new Set<() => void>();
  let version = 0;

  return {
    targetIds: [...items.keys()],
    read: (id: string): Item => items.get(id) ?? BASE_ITEM,
    update: (id: string, patch: Partial<Item>) => {
      items.set(id, { ...(items.get(id) ?? BASE_ITEM), ...patch });
      version += 1;
      listeners.forEach((listener) => {
        listener();
      });
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
  };
}

type Items = ReturnType<typeof createItems>;

function massOf(items: Items) {
  return numberProperty({
    id: 'mass',
    label: messageRef(messages, 'mass'),
    min: 0,
    read: (id) => items.read(id).mass,
    write: (id, mass) => {
      items.update(id, { mass });
    },
  });
}

function Harness({
  items,
  property,
}: {
  readonly items: Items;
  readonly property: PropertyDescription;
}) {
  useSyncExternalStore(items.subscribe, items.getVersion);

  return (
    <PropertyRowGroup>
      <PropertyField property={property} targetIds={items.targetIds} />
    </PropertyRowGroup>
  );
}

let editor: TestEditor;

class FakeResizeObserver {
  observe(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

function show(items: Items, property: PropertyDescription) {
  render(
    <TestEditorProviders editor={editor}>
      <Harness items={items} property={property} />
    </TestEditorProviders>,
  );
}

function input(name: string): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`${name} is not an input element`);
  }

  return element;
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  editor = createTestEditor();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('PropertyField', () => {
  it('shows the translated label and the value of the targets', () => {
    const items = createItems({ a: { mass: 2 }, b: { mass: 2 } });
    show(items, massOf(items));

    expect(input('Mass').value).toBe('2');
  });

  it('writes a committed value to every target as one undo entry', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { mass: 2 }, b: { mass: 3 } });
    show(items, massOf(items));

    await user.type(input('Mass'), '5{Enter}');

    expect([items.read('a').mass, items.read('b').mass]).toEqual([5, 5]);

    editor.registries.undo.undo();

    expect([items.read('a').mass, items.read('b').mass]).toEqual([2, 3]);
    expect(editor.registries.undo.canUndo()).toBe(false);
  });

  it('shows a mixed value as a dash', () => {
    const items = createItems({ a: { mass: 2 }, b: { mass: 3 } });
    show(items, massOf(items));

    expect(input('Mass').value).toBe('');
  });

  it('makes a read-only property not editable', () => {
    const items = createItems({ a: {} });
    show(items, { ...massOf(items), readOnly: true });

    expect(input('Mass').readOnly).toBe(true);
  });

  it('draws nothing for a hidden property', () => {
    const items = createItems({ a: {} });
    show(items, { ...massOf(items), hidden: true });

    expect(screen.queryByRole('spinbutton')).toBeNull();
  });

  it('changes only the edited component of a vector on every target', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { position: [1, 2, 3] }, b: { position: [4, 5, 6] } });
    show(
      items,
      vectorProperty({
        id: 'position',
        label: messageRef(messages, 'position'),
        dimensions: 3,
        read: (id) => items.read(id).position,
        write: (id, position) => {
          items.update(id, { position });
        },
      }),
    );

    await user.type(input('Position Y'), '9{Enter}');

    expect([items.read('a').position, items.read('b').position]).toEqual([
      [1, 9, 3],
      [4, 9, 6],
    ]);
  });

  it('shows the translated options of an enumeration', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { mode: 'off' } });
    show(
      items,
      enumProperty({
        id: 'mode',
        label: messageRef(messages, 'mode'),
        options: [
          { value: 'off', label: messageRef(messages, 'modeOff') },
          { value: 'on', label: messageRef(messages, 'modeOn') },
        ],
        read: (id) => items.read(id).mode,
        write: (id, mode) => {
          items.update(id, { mode });
        },
      }),
    );

    await user.click(screen.getByRole('combobox', { name: 'Mode' }));
    await user.click(screen.getByRole('option', { name: 'On' }));

    expect(items.read('a').mode).toBe('on');
  });

  it('turns a flag on for every target and keeps the other flags of each one', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { layers: ['ground'] }, b: { layers: [] } });
    show(
      items,
      flagsProperty({
        id: 'layers',
        label: messageRef(messages, 'layers'),
        options: [
          { value: 'water', label: messageRef(messages, 'water') },
          { value: 'ground', label: messageRef(messages, 'ground') },
        ],
        read: (id) => items.read(id).layers,
        write: (id, layers) => {
          items.update(id, { layers });
        },
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Layers' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Water' }));

    expect([items.read('a').layers, items.read('b').layers]).toEqual([
      ['water', 'ground'],
      ['water'],
    ]);
  });

  it('turns a mixed boolean on for every target', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { visible: true }, b: { visible: false } });
    show(
      items,
      booleanProperty({
        id: 'visible',
        label: messageRef(messages, 'visible'),
        read: (id) => items.read(id).visible,
        write: (id, visible) => {
          items.update(id, { visible });
        },
      }),
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Visible' });

    expect(checkbox instanceof HTMLInputElement && checkbox.indeterminate).toBe(true);

    await user.click(checkbox);

    expect([items.read('a').visible, items.read('b').visible]).toEqual([true, true]);
  });

  it('edits list items through the item projection and keeps their keys', async () => {
    const user = userEvent.setup();
    const items = createItems({ a: { waypoints: [{ id: 'w1', position: [0, 0, 0] }] } });
    show(
      items,
      listProperty({
        id: 'waypoints',
        label: messageRef(messages, 'waypoints'),
        item: {
          type: 'vector',
          dimensions: 3,
          read: (waypoint) => waypoint.position,
          write: (waypoint, position) => ({ ...waypoint, position }),
        },
        createItem: (): Waypoint => ({ id: 'new', position: [0, 0, 0] }),
        getItemKey: (waypoint) => waypoint.id,
        read: (id) => items.read(id).waypoints,
        write: (id, waypoints) => {
          items.update(id, { waypoints });
        },
      }),
    );

    await user.type(input('Element 0 X'), '7{Enter}');
    await user.click(screen.getByRole('button', { name: 'Add element' }));

    expect(items.read('a').waypoints).toEqual([
      { id: 'w1', position: [7, 0, 0] },
      { id: 'new', position: [0, 0, 0] },
    ]);
  });

  it('draws a custom type with the editor registered for it', async () => {
    const user = userEvent.setup();
    const layerType = definePropertyType<number>({ id: 'test.layer' });
    const items = createItems({ a: { layer: 1 } });

    function LayerEditor({ label, value, onValueChange }: PropertyEditorProps<number>) {
      return (
        <button
          type="button"
          aria-label={label}
          value={value}
          onClick={() => {
            onValueChange(value + 1, 'commit');
          }}
        />
      );
    }

    editor.registries.propertyEditors.register(layerType, LayerEditor);
    show(
      items,
      customProperty({
        id: 'layer',
        label: messageRef(messages, 'layer'),
        valueType: layerType,
        read: (id) => items.read(id).layer,
        write: (id, layer) => {
          items.update(id, { layer });
        },
      }),
    );

    const button = screen.getByRole('button', { name: 'Layer' });

    expect(button.getAttribute('value')).toBe('1');

    await user.click(button);

    expect(items.read('a').layer).toBe(2);
    expect(button.getAttribute('value')).toBe('2');
  });
});
