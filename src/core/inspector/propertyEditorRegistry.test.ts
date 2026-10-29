import { describe, expect, it, vi } from 'vitest';
import type { PropertyEditorProps } from '@/contracts/property';
import { definePropertyType } from './properties';
import { createPropertyEditorRegistry } from './propertyEditorRegistry';

interface Layer {
  readonly index: number;
}

const layerType = definePropertyType<Layer>({ id: 'test.layer' });

function LayerEditor({ value }: PropertyEditorProps<Layer>) {
  return value.index;
}

function OtherLayerEditor() {
  return null;
}

describe('createPropertyEditorRegistry', () => {
  it('finds the editor of a type until it is unregistered', () => {
    const registry = createPropertyEditorRegistry();
    const unregister = registry.register(layerType, LayerEditor);

    expect(registry.get(layerType)).toBe(LayerEditor);

    unregister();

    expect(registry.get(layerType)).toBeUndefined();
  });

  it('does not give the editor to another type with the same id', () => {
    const registry = createPropertyEditorRegistry();
    const sameIdType = definePropertyType<Layer>({ id: layerType.id });
    registry.register(layerType, LayerEditor);

    expect(registry.get(sameIdType)).toBeUndefined();
  });

  it('reports a second editor for the same type in development', () => {
    const registry = createPropertyEditorRegistry();
    registry.register(layerType, LayerEditor);

    expect(() => registry.register(layerType, OtherLayerEditor)).toThrow(/test\.layer/);
  });

  it('notifies subscribers about registrations', () => {
    const registry = createPropertyEditorRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    registry.register(layerType, LayerEditor);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(registry.getSnapshot()).toHaveLength(1);
  });
});
