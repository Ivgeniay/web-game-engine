import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  InspectorSection,
  InspectorSectionProps,
  InspectorSectionTarget,
  InspectorSource,
} from '@/contracts/inspector';
import { defineCommand } from '@/core/commands/command';
import type { CommandInvocation } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { booleanProperty, numberProperty } from '@/core/inspector/properties';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { Inspector } from './Inspector';
import { InspectorSectionFrame } from './InspectorSectionFrame';
import { inspectorSectionMenu } from './inspectorMenus';

const messages = defineMessages({
  en: {
    body: 'Body',
    mass: 'Mass',
    shadows: 'Shadows',
    castShadows: 'Cast shadows',
    notes: 'Notes',
    remove: 'Remove component',
  },
  ru: {
    body: 'Тело',
    mass: 'Масса',
    shadows: 'Тени',
    castShadows: 'Отбрасывать тени',
    notes: 'Заметки',
    remove: 'Удалить компонент',
  },
});

interface Body {
  readonly enabled: boolean;
  readonly mass: number;
  readonly castShadows: boolean;
}

const BASE_BODY: Body = { enabled: true, mass: 1, castShadows: true };

const removeSection = defineCommand<InspectorSectionTarget>({
  id: 'test.removeSection',
  label: messageRef(messages, 'remove'),
});

function createScene(initial: Readonly<Record<string, Partial<Body>>>) {
  const bodies = new Map(
    Object.entries(initial).map(([id, body]) => [id, { ...BASE_BODY, ...body }]),
  );
  const listeners = new Set<() => void>();
  const read = (id: string) => bodies.get(id) ?? BASE_BODY;
  const update = (id: string, patch: Partial<Body>) => {
    bodies.set(id, { ...read(id), ...patch });
    listeners.forEach((listener) => {
      listener();
    });
  };
  const body: InspectorSection = {
    id: 'body',
    type: 'test.body',
    title: messageRef(messages, 'body'),
    enabled: {
      read: (id) => read(id).enabled,
      write: (id, enabled) => {
        update(id, { enabled });
      },
    },
    items: [
      numberProperty({
        id: 'mass',
        label: messageRef(messages, 'mass'),
        defaultValue: 1,
        read: (id) => read(id).mass,
        write: (id, mass) => {
          update(id, { mass });
        },
      }),
      {
        type: 'group',
        id: 'shadows',
        label: messageRef(messages, 'shadows'),
        properties: [
          booleanProperty({
            id: 'castShadows',
            label: messageRef(messages, 'castShadows'),
            read: (id) => read(id).castShadows,
            write: (id, castShadows) => {
              update(id, { castShadows });
            },
          }),
        ],
      },
    ],
  };
  const notes: InspectorSection = {
    id: 'notes',
    type: 'test.notes',
    title: messageRef(messages, 'notes'),
    items: [],
  };
  const source: InspectorSource = {
    getSections: () => [body, notes],
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  return { source, read, update };
}

class FakeResizeObserver {
  observe(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

let editor: TestEditor;

function show(source: InspectorSource, targetIds: readonly string[]) {
  return render(
    <TestEditorProviders editor={editor}>
      <Inspector source={source} targetIds={targetIds} />
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

function sectionToggle(name: string): HTMLElement {
  return screen.getByRole('button', { name, expanded: true });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  editor = createTestEditor();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Inspector', () => {
  it('draws the sections with their properties and groups', () => {
    const { source } = createScene({ a: {} });
    show(source, ['a']);

    expect(screen.getByText('Body')).toBeDefined();
    expect(screen.getByText('Notes')).toBeDefined();
    expect(input('Mass').value).toBe('1');
    expect(sectionToggle('Shadows')).toBeDefined();
    expect(screen.getByRole('checkbox', { name: 'Cast shadows' })).toBeDefined();
  });

  it('draws nothing without targets', () => {
    const { source } = createScene({ a: {} });
    const { container } = show(source, []);

    expect(container.textContent).toBe('');
  });

  it('turns a section on for every target with its checkbox', async () => {
    const user = userEvent.setup();
    const { source, read } = createScene({ a: { enabled: true }, b: { enabled: false } });
    show(source, ['a', 'b']);
    const checkbox = screen.getByRole('checkbox', { name: 'Enable Body' });

    expect(checkbox instanceof HTMLInputElement && checkbox.indeterminate).toBe(true);

    await user.click(checkbox);

    expect([read('a').enabled, read('b').enabled]).toEqual([true, true]);
  });

  it('redraws when the source reports a change', () => {
    const { source, update } = createScene({ a: {} });
    show(source, ['a']);

    act(() => {
      update('a', { mass: 7 });
    });

    expect(input('Mass').value).toBe('7');
  });

  it('keeps a collapsed section collapsed for other targets', async () => {
    const user = userEvent.setup();
    const { source } = createScene({ a: {}, b: {} });
    const { rerender } = show(source, ['a']);

    await user.click(sectionToggle('Body'));
    rerender(
      <TestEditorProviders editor={editor}>
        <Inspector source={source} targetIds={['b']} />
      </TestEditorProviders>,
    );

    expect(screen.getByRole('button', { name: 'Body', expanded: false })).toBeDefined();
  });

  it('shows the items of the section menu with the section as the target', async () => {
    const user = userEvent.setup();
    const run = vi.fn<(invocation: CommandInvocation<InspectorSectionTarget>) => void>();
    const { source } = createScene({ a: {} });
    editor.registries.commands.handle(removeSection, { run });
    editor.registries.contextMenus.registerItem(inspectorSectionMenu, {
      path: 'remove',
      command: removeSection,
      group: 0,
      order: 0,
    });
    show(source, ['a']);

    await user.click(screen.getByRole('button', { name: 'Body menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Remove component' }));

    await waitFor(() => {
      expect(run).toHaveBeenCalledOnce();
    });
    const [invocation] = run.mock.lastCall ?? [];

    expect(invocation?.target.section.id).toBe('body');
    expect(invocation?.target.targetIds).toEqual(['a']);
  });

  it('draws a section with the renderer registered for its type', () => {
    const { source } = createScene({ a: {} });

    function NotesSection(props: InspectorSectionProps) {
      return (
        <InspectorSectionFrame {...props}>
          <output aria-label={props.section.id}>{props.targetIds.join()}</output>
        </InspectorSectionFrame>
      );
    }

    editor.registries.inspectorSections.register({ type: 'test.notes', component: NotesSection });
    show(source, ['a']);

    expect(screen.getByRole('status', { name: 'notes' }).textContent).toBe('a');
  });

  it('marks a changed property and resets every target to the default as one undo entry', async () => {
    const user = userEvent.setup();
    const { source, read } = createScene({ a: { mass: 5 }, b: { mass: 1 } });
    show(source, ['a', 'b']);
    const massRow = () => input('Mass').closest('[data-markable]');

    expect(massRow()?.hasAttribute('data-modified')).toBe(true);
    expect(screen.getByRole('button', { name: 'Reset to default' }).closest('[inert]')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Reset to default' }));

    expect(massRow()?.hasAttribute('data-modified')).toBe(false);

    expect([read('a').mass, read('b').mass]).toEqual([1, 1]);
    expect(
      screen.getByRole('button', { name: 'Reset to default', hidden: true }).closest('[inert]'),
    ).not.toBeNull();

    editor.registries.undo.undo();

    expect([read('a').mass, read('b').mass]).toEqual([5, 1]);
  });
});
