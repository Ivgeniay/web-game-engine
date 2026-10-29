import { describe, expectTypeOf, it } from 'vitest';
import type {
  EnumProperty,
  ListProperty,
  PropertyDescription,
  PropertyType,
} from '@/contracts/property';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import {
  customProperty,
  definePropertyType,
  enumProperty,
  listProperty,
  numberProperty,
} from './properties';

const messages = defineMessages({
  en: { value: 'Value', none: 'None', some: 'Some' },
  ru: { value: 'Значение', none: 'Нет', some: 'Есть' },
});

type Mode = 'none' | 'some';

interface Waypoint {
  readonly id: string;
  readonly position: readonly number[];
}

interface Layer {
  readonly index: number;
}

const label = messageRef(messages, 'value');

const mode = enumProperty({
  id: 'mode',
  label,
  options: [
    { value: 'none', label: messageRef(messages, 'none') },
    { value: 'some', label: messageRef(messages, 'some') },
  ],
  read: (): Mode => 'none',
  write: () => undefined,
});

const waypoints = listProperty({
  id: 'waypoints',
  label,
  item: {
    type: 'vector',
    dimensions: 3,
    read: (waypoint) => waypoint.position,
    write: (waypoint, position) => ({ ...waypoint, position }),
  },
  createItem: (): Waypoint => ({ id: 'w', position: [0, 0, 0] }),
  read: () => [],
  write: () => undefined,
});

const layerType = definePropertyType<Layer>({ id: 'example.layer' });

const layer = customProperty({
  id: 'layer',
  label,
  valueType: layerType,
  read: () => ({ index: 0 }),
  write: () => undefined,
});

describe('property constructors', () => {
  it('infers the value type of an enumeration from its options', () => {
    expectTypeOf(mode).toEqualTypeOf<EnumProperty<Mode>>();
  });

  it('infers the item type of a list', () => {
    expectTypeOf(waypoints).toEqualTypeOf<ListProperty<Waypoint>>();
  });

  it('keeps the value type of a custom property', () => {
    expectTypeOf(layer.valueType).toEqualTypeOf<PropertyType<Layer>>();
  });

  it('puts properties of different types into one list', () => {
    expectTypeOf([mode, waypoints, layer]).toExtend<readonly PropertyDescription[]>();
  });

  it('requires a range for a slider', () => {
    expectTypeOf<{
      slider: true;
      id: string;
      label: typeof label;
      read: () => number;
      write: () => void;
    }>().not.toExtend<Parameters<typeof numberProperty>[0]>();
    expectTypeOf<{
      slider: true;
      min: number;
      max: number;
      id: string;
      label: typeof label;
      read: () => number;
      write: () => void;
    }>().toExtend<Parameters<typeof numberProperty>[0]>();
  });

  it('does not mix custom value types', () => {
    expectTypeOf(layerType).not.toExtend<PropertyType<string>>();
  });
});
