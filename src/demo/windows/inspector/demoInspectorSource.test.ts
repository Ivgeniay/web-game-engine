import { describe, expect, it, vi } from 'vitest';
import { createSceneStore } from '@/demo/scene/sceneStore';
import type { SceneStore } from '@/demo/scene/sceneStore';
import { componentOfSection, createDemoInspectorSource } from './demoInspectorSource';

function idOf(scene: SceneStore, name: string): string {
  const found = scene.getState().objects.find((object) => object.name === name);

  if (found === undefined) {
    throw new Error(`No object ${name}`);
  }

  return found.id;
}

describe('createDemoInspectorSource', () => {
  it('gives the sections of the components that every target has', () => {
    const scene = createSceneStore();
    const source = createDemoInspectorSource(scene);
    const sections = (names: readonly string[]) =>
      source
        .getSections(names.map((name) => idOf(scene, name)))
        .map((section) => componentOfSection(section));

    expect(sections(['Player'])).toEqual(['transform', 'rigidbody', 'path']);
    expect(sections(['Player', 'Lamp'])).toEqual(['transform']);
    expect(sections(['Directional Light', 'Lamp'])).toEqual(['transform', 'light']);
  });

  it('reports changes of the scene', () => {
    const scene = createSceneStore();
    const listener = vi.fn();
    createDemoInspectorSource(scene).subscribe(listener);

    scene.getState().toggleGrid();

    expect(listener).toHaveBeenCalledOnce();
  });
});
