import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import type { Unsubscribe } from '@/core/unsubscribe';
import { EditorFrame } from '@/shell/EditorFrame';
import { createTestEditor } from '@/shell/testEditor';
import type { TestEditor } from '@/shell/testEditor';
import { TestEditorProviders } from '@/shell/TestEditorProviders';
import { selectedObjects } from './scene/sceneStore';
import {
  TEST_ROW_HEIGHT,
  TEST_VISIBLE_ROWS,
  installVirtualListEnvironment,
} from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { installDemo } from './demoExtension';
import { DemoStoresContext, createDemoStores } from './demoStores';
import type { DemoStores } from './demoStores';

let stopHotkeys: Unsubscribe | null = null;
let environment: VirtualListTestEnvironment;

beforeEach(() => {
  environment = installVirtualListEnvironment();
});

afterEach(() => {
  stopHotkeys?.();
  stopHotkeys = null;
  cleanup();
  environment.restore();
  Reflect.deleteProperty(document, 'elementFromPoint');
});

function playModeStatus(): string | null {
  return within(screen.getByRole('contentinfo')).getByRole('status').textContent;
}

async function renderDemo(): Promise<{ editor: TestEditor; stores: DemoStores }> {
  const editor = createTestEditor();
  const stores = createDemoStores();
  installDemo(stores)(editor.registries);
  stopHotkeys = startHotkeyController({
    commands: editor.registries.commands,
    target: document,
    platform: 'other',
    areGlobalHotkeysBlocked: () => false,
  });
  render(
    <TestEditorProviders editor={editor}>
      <DemoStoresContext value={stores}>
        <EditorFrame />
      </DemoStoresContext>
    </TestEditorProviders>,
  );
  await waitFor(() => {
    expect(editor.registries.workspace.isAttached()).toBe(true);
  });

  return { editor, stores };
}

describe('demo integration', () => {
  it('opens the windows in the classic layout', async () => {
    const { editor } = await renderDemo();

    expect(editor.registries.workspace.getWindows().map(({ id }) => id)).toEqual([
      'demo.hierarchy',
      'demo.scene',
      'demo.game',
      'demo.project',
      'demo.inspector',
    ]);
  });

  it('fills the menu bar, the toolbar and the status bar', async () => {
    await renderDemo();
    const menuBar = screen.getByRole('menubar');
    const toolbar = screen.getByRole('toolbar');

    expect(
      within(menuBar)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['File', 'Edit', 'GameObject', 'Window']);
    expect(within(toolbar).getByRole('button', { name: 'Play' })).toBeDefined();
    expect(within(toolbar).getByRole('button', { name: 'Move tool' })).toBeDefined();
    expect(playModeStatus()).toBe('Edit mode');
  });

  it('enters Play mode from the toolbar', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(within(screen.getByRole('toolbar')).getByRole('button', { name: 'Play' }));

    expect(stores.playMode.getState().mode).toBe('play');
    expect(playModeStatus()).toBe('Play modeFrame 0');
  });

  it('deletes the selected object with Delete only inside the hierarchy and undoes it', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(object('Player'));
    await user.click(within(screen.getByRole('toolbar')).getByRole('button', { name: 'Play' }));
    await user.keyboard('{Delete}');

    expect(objectNames(stores)).toContain('Player');

    await user.click(object('Player'));
    await user.keyboard('{Delete}');

    expect(objectNames(stores)).not.toContain('Player');
    expect(objectNames(stores)).not.toContain('Weapon');

    await user.keyboard('{Control>}z{/Control}');

    expect(objectNames(stores)).toContain('Weapon');
    expect(selectedNames(stores)).toEqual(['Player']);
  });

  it('switches the tool with its shortcut', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();
    act(() => {
      document.body.focus();
    });

    await user.keyboard('e');

    expect(stores.scene.getState().tool).toBe('rotate');
  });

  it('edits the object selected in the hierarchy and undoes the edits', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(object('Player'));

    const positionX = screen.getByRole('spinbutton', { name: 'Position X' });
    const player = () => stores.scene.getState().objects.find(({ name }) => name === 'Player');

    await user.clear(positionX);
    await user.type(positionX, '5{Enter}');

    expect(player()?.transform.position).toEqual([5, 0, 0]);

    await user.click(screen.getByRole('checkbox', { name: 'Use gravity' }));

    expect(player()?.rigidbody?.useGravity).toBe(false);

    await user.keyboard('{Control>}z{/Control}');

    expect(player()?.rigidbody?.useGravity).toBe(true);

    await user.click(within(screen.getByRole('menubar')).getByRole('menuitem', { name: 'Edit' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Undo' }));

    expect(player()?.transform.position).toEqual([0, 0, 0]);
    expect(positionX).toHaveProperty('value', '0');

    await user.click(within(screen.getByRole('menubar')).getByRole('menuitem', { name: 'Edit' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Redo' }));

    expect(player()?.transform.position).toEqual([5, 0, 0]);
  });

  it('shows the shared components of several objects with mixed values', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();

    await user.click(object('Directional Light'));
    await user.keyboard('{Control>}');
    await user.click(object('Lamp'));
    await user.keyboard('{/Control}');

    const intensity = screen.getByRole('spinbutton', { name: 'Intensity' });

    expect(intensity).toHaveProperty('value', '');
    expect(screen.queryByRole('spinbutton', { name: 'Mass' })).toBeNull();
    expect(screen.getByRole('checkbox', { name: 'Cast shadows' })).toHaveProperty(
      'indeterminate',
      true,
    );

    await user.click(intensity);
    await user.type(intensity, '3{Enter}');

    expect(lightIntensities(stores)).toEqual([3, 3]);

    act(() => {
      editor.registries.undo.undo();
    });

    expect(lightIntensities(stores)).toEqual([1, 2]);
  });

  it('renames an object from the context menu and undoes the rename', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.pointer({ keys: '[MouseRight]', target: object('Main Camera') });
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }));

    const field = await screen.findByRole('textbox', { name: 'Object name' });
    await waitFor(() => {
      expect(document.activeElement).toBe(field);
    });
    await user.keyboard('Camera{Enter}');

    expect(objectNames(stores)[0]).toBe('Camera');

    await user.keyboard('{Control>}z{/Control}');

    expect(objectNames(stores)[0]).toBe('Main Camera');
  });

  it('moves an object into another one by dragging and undoes the move', async () => {
    const { stores, editor } = await renderDemo();
    const tree = screen.getByRole('tree', { name: 'Hierarchy' });
    const rows = () => within(tree).getAllByRole('treeitem');
    const rowTop = (name: string) =>
      rows().findIndex((row) => row.textContent === name) * TEST_ROW_HEIGHT;
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => tree });
    vi.spyOn(tree, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 0, width: TREE_HEIGHT, height: TREE_HEIGHT }),
    );
    const cameraTop = rowTop('Main Camera') + MIDDLE_OF_ROW;
    const playerMiddle = rowTop('Player') + MIDDLE_OF_ROW;

    fireEvent.pointerDown(object('Main Camera'), { clientX: 10, clientY: cameraTop, button: 0 });
    fireEvent.pointerMove(window, { clientX: 10, clientY: playerMiddle });
    fireEvent.pointerUp(window, { clientX: 10, clientY: playerMiddle });

    expect(parentName(stores, 'Main Camera')).toBe('Player');

    act(() => {
      editor.registries.undo.undo();
    });

    expect(parentName(stores, 'Main Camera')).toBeNull();
  });

  it('resets a component from its menu for all selected objects', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();

    await user.click(object('Directional Light'));
    await user.click(screen.getByRole('button', { name: 'Light menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Reset' }));

    await waitFor(() => {
      expect(
        stores.scene.getState().objects.find(({ name }) => name === 'Directional Light')?.light
          ?.type,
      ).toBe('point');
    });
    expect(lightIntensities(stores)).toEqual([1, 2]);
  });

  it('finds assets in the project with the search', async () => {
    const user = userEvent.setup();
    await renderDemo();

    await user.type(screen.getByRole('searchbox', { name: 'Search the project' }), 'health');
    const project = screen.getByRole('tree', { name: 'Project' });

    expect(
      within(project)
        .getAllByRole('treeitem')
        .map((row) => row.textContent),
    ).toEqual(['Assets', 'Scripts', 'Gameplay', 'Health.ts', 'UI', 'HealthBar.ts']);
  });
});

const TREE_HEIGHT = TEST_ROW_HEIGHT * TEST_VISIBLE_ROWS;
const MIDDLE_OF_ROW = TEST_ROW_HEIGHT / 2;

function object(name: string): HTMLElement {
  return within(screen.getByRole('tree', { name: 'Hierarchy' })).getByRole('treeitem', { name });
}

function objectNames(stores: DemoStores): readonly string[] {
  return stores.scene.getState().objects.map(({ name }) => name);
}

function selectedNames(stores: DemoStores): readonly string[] {
  return selectedObjects(stores.scene.getState()).map(({ name }) => name);
}

function lightIntensities(stores: DemoStores): readonly number[] {
  return stores.scene
    .getState()
    .objects.flatMap(({ light }) => (light === null ? [] : [light.intensity]));
}

function parentName(stores: DemoStores, name: string): string | null {
  const { objects } = stores.scene.getState();
  const parentId = objects.find((item) => item.name === name)?.parentId;

  return objects.find(({ id }) => id === parentId)?.name ?? null;
}
