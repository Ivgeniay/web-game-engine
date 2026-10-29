import { describe, expect, it } from 'vitest';
import { createInspectorSectionRegistry } from './inspectorSectionRegistry';

function NotesSection() {
  return null;
}

describe('createInspectorSectionRegistry', () => {
  it('finds the renderer of a section type until it is unregistered', () => {
    const registry = createInspectorSectionRegistry();
    const unregister = registry.register({ type: 'test.notes', component: NotesSection });

    expect(registry.get('test.notes')?.component).toBe(NotesSection);

    unregister();

    expect(registry.get('test.notes')).toBeUndefined();
  });

  it('reports a second renderer for the same type in development', () => {
    const registry = createInspectorSectionRegistry();
    registry.register({ type: 'test.notes', component: NotesSection });

    expect(() => registry.register({ type: 'test.notes', component: NotesSection })).toThrow(
      /test\.notes/,
    );
  });
});
