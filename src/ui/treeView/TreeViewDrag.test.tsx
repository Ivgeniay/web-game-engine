import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DragAndDropLayer } from '@/ui/dragAndDrop/DragAndDropLayer';
import type { DragData } from '@/ui/dragAndDrop/dragData';
import {
  TEST_ROW_HEIGHT,
  TEST_VISIBLE_ROWS,
  installVirtualListEnvironment,
} from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import type { TreeDropTarget } from './treeDrop';
import { TEST_TREE } from './treeTestModel';
import { TreeView } from './TreeView';
import { AUTO_EXPAND_DELAY_MS } from './useTreeDragAndDrop';
import { useTreeViewState } from './useTreeViewState';
import type { TreeViewInitialState } from './useTreeViewState';

const TREE_LABEL = 'Hierarchy';
const NODE_TYPE = 'scene-object';
const VIEW_HEIGHT = TEST_ROW_HEIGHT * TEST_VISIBLE_ROWS;
const POINTER_X = 50;
const TOP_OF_ROW = 2;
const MIDDLE_OF_ROW = TEST_ROW_HEIGHT / 2;
const BOTTOM_OF_ROW = TEST_ROW_HEIGHT - 2;
const NEAR_BOTTOM_EDGE = VIEW_HEIGHT - 2;

interface HarnessProps {
  readonly initial?: TreeViewInitialState;
  readonly onDropData?: (data: DragData, target: TreeDropTarget) => void;
  readonly canDropData?: (data: DragData, target: TreeDropTarget) => boolean;
}

function Harness({ initial, onDropData = vi.fn(), canDropData }: HarnessProps) {
  const state = useTreeViewState(initial);

  return (
    <DragAndDropLayer>
      <TreeView
        aria-label={TREE_LABEL}
        model={TEST_TREE}
        selectionMode="multiple"
        dragType={NODE_TYPE}
        onDropData={onDropData}
        canDropData={canDropData}
        {...state}
      />
    </DragAndDropLayer>
  );
}

let environment: VirtualListTestEnvironment;

function tree(): HTMLElement {
  return screen.getByRole('tree', { name: TREE_LABEL });
}

function item(name: string): HTMLElement {
  return screen.getByRole('treeitem', { name });
}

function rowTop(name: string): number {
  const index = screen.getAllByRole('treeitem').findIndex((row) => row.textContent === name);

  return index * TEST_ROW_HEIGHT;
}

function selectedNames(): readonly string[] {
  return screen.queryAllByRole('treeitem', { selected: true }).map((row) => row.textContent);
}

beforeEach(() => {
  environment = installVirtualListEnvironment();
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: () => tree(),
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ x: 0, y: 0, width: VIEW_HEIGHT, height: VIEW_HEIGHT }),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  environment.restore();
  Reflect.deleteProperty(document, 'elementFromPoint');
});

function startDrag(name: string): void {
  const clientY = rowTop(name) + MIDDLE_OF_ROW;

  fireEvent.pointerDown(item(name), { clientX: POINTER_X, clientY, button: 0 });
  fireEvent.pointerMove(window, { clientX: POINTER_X + TEST_ROW_HEIGHT, clientY });
}

function moveTo(clientY: number): void {
  fireEvent.pointerMove(window, { clientX: POINTER_X, clientY });
}

function release(clientY: number): void {
  fireEvent.pointerUp(window, { clientX: POINTER_X, clientY });
}

function dropLine(): Element | null {
  return tree().querySelector('[data-drop-line]');
}

describe('TreeView drag and drop', () => {
  it('drops an unselected row inside another node and selects it first', () => {
    const onDropData = vi.fn();
    render(<Harness onDropData={onDropData} />);

    startDrag('Player');

    expect(selectedNames()).toEqual(['Player']);

    const inside = rowTop('Light') + MIDDLE_OF_ROW;
    moveTo(inside);

    expect(item('Light').hasAttribute('data-drop-inside')).toBe(true);

    release(inside);

    expect(onDropData).toHaveBeenCalledExactlyOnceWith(
      { type: NODE_TYPE, ids: ['player'], label: 'Player' },
      { kind: 'node', id: 'light', position: 'inside' },
    );
    expect(item('Light').hasAttribute('data-drop-inside')).toBe(false);
  });

  it('drags the whole selection without the descendants of selected nodes', () => {
    const onDropData = vi.fn();
    render(
      <Harness
        initial={{ expandedIds: ['world'], selectedIds: ['terrain', 'world', 'light'] }}
        onDropData={onDropData}
      />,
    );

    startDrag('Light');
    const before = rowTop('Player') + TOP_OF_ROW;
    moveTo(before);

    expect(dropLine()).not.toBeNull();

    release(before);

    expect(onDropData).toHaveBeenCalledExactlyOnceWith(
      { type: NODE_TYPE, ids: ['world', 'light'], label: 'World (+1)' },
      { kind: 'node', id: 'player', position: 'before' },
    );
  });

  it('does not drop a node into its own descendant', () => {
    const onDropData = vi.fn();
    render(<Harness initial={{ expandedIds: ['world'] }} onDropData={onDropData} />);

    startDrag('World');
    const intoChild = rowTop('Props') + MIDDLE_OF_ROW;
    moveTo(intoChild);

    expect(item('Props').hasAttribute('data-drop-inside')).toBe(false);
    expect(dropLine()).toBeNull();

    release(intoChild);

    expect(onDropData).not.toHaveBeenCalled();
  });

  it('asks the owner whether the place accepts the data', () => {
    const onDropData = vi.fn();
    render(
      <Harness onDropData={onDropData} canDropData={(_data, target) => target.kind === 'root'} />,
    );

    startDrag('Player');
    moveTo(rowTop('Light') + MIDDLE_OF_ROW);
    release(rowTop('Light') + MIDDLE_OF_ROW);

    expect(onDropData).not.toHaveBeenCalled();
  });

  it('drops below the last row to the end of the roots', () => {
    const onDropData = vi.fn();
    render(<Harness onDropData={onDropData} />);

    startDrag('World');
    moveTo(NEAR_BOTTOM_EDGE - TEST_ROW_HEIGHT);
    release(NEAR_BOTTOM_EDGE - TEST_ROW_HEIGHT);

    expect(onDropData).toHaveBeenCalledWith(expect.anything(), { kind: 'root' });
  });

  it('expands a collapsed node after holding the pointer over it', () => {
    vi.useFakeTimers();
    render(<Harness />);

    startDrag('Light');
    moveTo(rowTop('World') + MIDDLE_OF_ROW);

    act(() => {
      vi.advanceTimersByTime(AUTO_EXPAND_DELAY_MS - 1);
    });

    expect(item('World').getAttribute('aria-expanded')).toBe('false');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(item('World').getAttribute('aria-expanded')).toBe('true');
  });

  it('scrolls while the pointer stays near the edge', () => {
    vi.useFakeTimers();
    render(<Harness initial={{ expandedIds: ['world', 'props', 'player'] }} />);

    startDrag('World');
    moveTo(NEAR_BOTTOM_EDGE);

    act(() => {
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
    });

    expect(environment.getScrollTop()).toBeGreaterThan(0);

    release(NEAR_BOTTOM_EDGE);
    const scrolled = environment.getScrollTop();

    act(() => {
      vi.advanceTimersToNextFrame();
    });

    expect(environment.getScrollTop()).toBe(scrolled);
  });

  it('cancels with Esc', () => {
    const onDropData = vi.fn();
    render(<Harness onDropData={onDropData} />);

    startDrag('Player');
    moveTo(rowTop('Light') + MIDDLE_OF_ROW);
    fireEvent.keyDown(window, { key: 'Escape' });
    release(rowTop('Light') + MIDDLE_OF_ROW);

    expect(onDropData).not.toHaveBeenCalled();
    expect(item('Light').hasAttribute('data-drop-inside')).toBe(false);
  });

  it('keeps the selection after the drop', () => {
    render(<Harness initial={{ selectedIds: ['player'] }} />);

    startDrag('Player');
    release(rowTop('Light') + BOTTOM_OF_ROW);
    fireEvent.click(tree());

    expect(selectedNames()).toEqual(['Player']);
  });

  it('does not start a drag from the expand arrow', () => {
    render(<Harness />);
    const arrow = item('World').querySelector('[data-tree-toggle]');

    if (arrow === null) {
      throw new Error('The row has no expand arrow');
    }

    fireEvent.pointerDown(arrow, { clientX: POINTER_X, clientY: MIDDLE_OF_ROW, button: 0 });
    moveTo(rowTop('Light') + MIDDLE_OF_ROW);

    expect(item('Light').hasAttribute('data-drop-inside')).toBe(false);
    expect(selectedNames()).toEqual([]);
  });
});
