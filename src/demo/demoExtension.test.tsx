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

  it('marks a changed property and resets it to the default', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const weapon = () => stores.scene.getState().objects.find(({ name }) => name === 'Weapon');

    await user.click(object('Weapon'));
    const resetMass = within(
      screen.getByRole('spinbutton', { name: 'Mass' }).closest('[data-modified]') ?? document.body,
    ).getByRole('button', { name: 'Reset to default' });

    await user.click(resetMass);

    expect(weapon()?.rigidbody?.mass).toBe(1);

    act(() => {
      editor.registries.undo.undo();
    });

    expect(weapon()?.rigidbody?.mass).toBe(0.2);
  });

  it('picks a material in the picker with a preview and one undo entry', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const model = () =>
      stores.scene.getState().objects.find(({ name }) => name === 'Model')?.meshRenderer;

    await user.click(object('Model'));
    const material = screen.getByRole('button', { name: 'Material' });

    expect(material.textContent).toBe('Player');

    await user.click(material);
    const dialog = await screen.findByRole('dialog', { name: 'Select Material' });
    await user.click(within(dialog).getByRole('option', { name: 'Ground' }));

    expect(model()?.material).toBe('Assets/Materials/Ground.mat');

    await user.keyboard('{Enter}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(material.textContent).toBe('Ground');

    act(() => {
      editor.registries.undo.undo();
    });

    expect(model()?.material).toBe('Assets/Materials/Player.mat');
  });

  it('takes a material dragged from the project window', async () => {
    const user = userEvent.setup();
    const { stores } = await renderDemo();
    const project = screen.getByRole('tree', { name: 'Project' });

    await user.click(object('Model'));
    await user.click(within(project).getByRole('treeitem', { name: 'Materials' }));
    await user.keyboard('{ArrowRight}');
    const rock = within(project).getByRole('treeitem', { name: 'Rock.mat' });
    const material = screen.getByRole('button', { name: 'Material' });
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: (clientX: number) => (clientX >= DROP_X ? material : rock),
    });

    fireEvent.pointerDown(rock, { clientX: 10, clientY: 10, button: 0 });
    fireEvent.pointerMove(window, { clientX: DROP_X, clientY: 10 });
    fireEvent.pointerUp(window, { clientX: DROP_X, clientY: 10 });

    expect(
      stores.scene.getState().objects.find(({ name }) => name === 'Model')?.meshRenderer?.material,
    ).toBe('Assets/Materials/Rock.mat');
  });

  it('changes the light color and intensity with one undo entry each', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const lamp = () => stores.scene.getState().objects.find(({ name }) => name === 'Lamp')?.light;
    stubPointerCapture();

    await user.click(object('Lamp'));
    screen.getByRole('slider', { name: 'Intensity' }).focus();
    await user.keyboard('{ArrowRight>3}{/ArrowRight}');

    expect(lamp()?.intensity).toBeCloseTo(2.3);

    await user.click(screen.getByRole('button', { name: 'Color' }));
    const area = await screen.findByRole('slider', { name: 'Saturation and brightness' });
    vi.spyOn(area, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 0, width: AREA_SIZE, height: AREA_SIZE }),
    );
    fireEvent.pointerDown(area, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(area, { pointerId: 1, clientX: AREA_SIZE, clientY: 0 });
    fireEvent.pointerUp(area, { pointerId: 1 });
    fireEvent.pointerDown(area, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerUp(area, { pointerId: 1 });
    await user.keyboard('{Tab}');
    await user.click(object('Lamp'));

    expect(lamp()?.color).toEqual({ r: 1, g: 1, b: 1, a: 1 });

    act(() => {
      editor.registries.undo.undo();
    });

    expect(lamp()?.color).toEqual({ r: 1, g: 0.7, b: 0.35, a: 1 });
    expect(lamp()?.intensity).toBeCloseTo(2.3);

    act(() => {
      editor.registries.undo.undo();
    });

    expect(lamp()?.intensity).toBe(2);
  });

  it('toggles a mixed constraint for every selected rigidbody and undoes it', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const constraints = () =>
      stores.scene
        .getState()
        .objects.flatMap(({ rigidbody }) => (rigidbody === null ? [] : [rigidbody.constraints]));

    await user.click(object('Player'));
    await user.keyboard('{Control>}');
    await user.click(object('Weapon'));
    await user.keyboard('{/Control}');
    const field = screen.getByRole('button', { name: 'Constraints' });

    expect(field.textContent).toBe('Mixed');

    await user.click(field);
    const freezeZ = screen.getByRole('menuitemcheckbox', { name: 'Freeze rotation Z' });

    expect(freezeZ.getAttribute('aria-checked')).toBe('mixed');

    await user.click(freezeZ);

    expect(constraints()).toEqual([
      ['freezeRotationX', 'freezeRotationZ'],
      ['freezeRotationX', 'freezeRotationZ'],
    ]);

    await user.keyboard('{Escape}');
    act(() => {
      editor.registries.undo.undo();
    });

    expect(constraints()).toEqual([['freezeRotationX', 'freezeRotationZ'], ['freezeRotationX']]);
  });

  it('adds a waypoint with one undo entry and shows different paths as mixed', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const waypointCount = () =>
      stores.scene.getState().objects.find(({ name }) => name === 'Player')?.path?.waypoints.length;

    await user.click(object('Player'));
    await user.click(screen.getByRole('button', { name: 'Add element' }));

    expect(waypointCount()).toBe(4);
    expect(screen.getByRole('spinbutton', { name: 'Element 3 X' })).toBeDefined();

    act(() => {
      editor.registries.undo.undo();
    });

    expect(waypointCount()).toBe(3);

    await user.keyboard('{Control>}');
    await user.click(object('Weapon'));
    await user.keyboard('{/Control}');

    expect(screen.getByRole('spinbutton', { name: 'Size' })).toHaveProperty('disabled', true);
    expect(screen.queryByRole('list', { name: 'Waypoints' })).toBeNull();
  });

  it('writes one note for several objects and undoes it', async () => {
    const user = userEvent.setup();
    const { stores, editor } = await renderDemo();
    const notes = () =>
      stores.scene.getState().objects.flatMap(({ note }) => (note === null ? [] : [note.text]));

    await user.click(object('Rocks'));
    await user.keyboard('{ArrowRight}');
    const [firstRock, secondRock] = within(
      screen.getByRole('tree', { name: 'Hierarchy' }),
    ).getAllByRole('treeitem', { name: 'Rock' });

    if (firstRock === undefined || secondRock === undefined) {
      throw new Error('The scene has two rocks');
    }

    await user.click(firstRock);
    await user.keyboard('{Control>}');
    await user.click(secondRock);
    await user.keyboard('{/Control}');
    const text = screen.getByRole('textbox', { name: 'Text' });

    expect(text).toHaveProperty('placeholder', '—');

    await user.type(text, 'Shared{Enter}line');
    await user.tab();

    expect(notes()).toEqual(['Shared\nline', 'Shared\nline']);

    act(() => {
      editor.registries.undo.undo();
    });

    expect(notes()).toEqual([
      'Cover for the first wave.',
      'Too close to the bridge.\nMove it before the next build.',
    ]);
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
const AREA_SIZE = 100;
const DROP_X = 500;

function stubPointerCapture(): void {
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
  });
}
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
