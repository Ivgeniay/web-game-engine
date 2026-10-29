import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { ListSelectionMode } from '@/ui/listView/listSelection';
import {
  TEST_VISIBLE_ROWS,
  installVirtualListEnvironment,
} from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { MacPlatformContext } from '@/ui/platform/macPlatformContext';
import { SearchField } from '@/ui/searchField/SearchField';
import { OVERSCAN_ROWS } from '@/ui/virtualList/virtualRange';
import type { TreeModel } from './treeModel';
import { TEST_TREE } from './treeTestModel';
import { TreeView } from './TreeView';
import { useTreeViewState } from './useTreeViewState';
import type { TreeViewInitialState } from './useTreeViewState';

const TREE_LABEL = 'Hierarchy';
const GROUP_COUNT = 100;
const GROUP_SIZE = 100;
const RENAME_LABEL = 'Object name';
const EMPTY_NAME_MESSAGE = 'Enter a name';
const OUTSIDE = 'Outside';
const RESULTS_SEARCH_LABEL = 'Search hierarchy';
const RESULTS_CLEAR_LABEL = 'Clear search';

interface HarnessProps {
  readonly model?: TreeModel;
  readonly selectionMode?: ListSelectionMode;
  readonly initial?: TreeViewInitialState;
  readonly filter?: string;
  readonly onRename?: (id: string, name: string) => void;
  readonly onExpandedIdsChange?: (expandedIds: readonly string[]) => void;
}

function validateName(name: string): string | undefined {
  return name.trim() === '' ? EMPTY_NAME_MESSAGE : undefined;
}

function Harness({
  model = TEST_TREE,
  selectionMode = 'multiple',
  initial,
  filter,
  onRename,
  onExpandedIdsChange,
}: HarnessProps) {
  const state = useTreeViewState(initial);

  return (
    <>
      <TreeView
        aria-label={TREE_LABEL}
        model={model}
        selectionMode={selectionMode}
        filter={filter}
        onRename={onRename}
        renameLabel={RENAME_LABEL}
        validateName={validateName}
        {...state}
        onExpandedIdsChange={(expandedIds) => {
          state.onExpandedIdsChange(expandedIds);
          onExpandedIdsChange?.(expandedIds);
        }}
      />
      <button type="button">{OUTSIDE}</button>
    </>
  );
}

function groupId(group: number): string {
  return `group-${String(group)}`;
}

function createLargeTree(): TreeModel {
  const groups = Array.from({ length: GROUP_COUNT }, (_, group) => groupId(group));

  return {
    rootIds: groups,
    getChildren: (id) =>
      Array.from({ length: GROUP_SIZE }, (_, child) => `${id}/item-${String(child)}`),
    hasChildren: (id) => !id.includes('/'),
    getLabel: (id) => id,
  };
}

let environment: VirtualListTestEnvironment;

beforeEach(() => {
  environment = installVirtualListEnvironment();
});

afterEach(() => {
  cleanup();
  environment.restore();
});

function tree(): HTMLElement {
  return screen.getByRole('tree', { name: TREE_LABEL });
}

function item(name: string): HTMLElement {
  return screen.getByRole('treeitem', { name });
}

function visibleNames(): readonly string[] {
  return screen.getAllByRole('treeitem').map((row) => row.textContent);
}

function selectedNames(): readonly string[] {
  return screen.queryAllByRole('treeitem', { selected: true }).map((row) => row.textContent);
}

function activeItem(): HTMLElement | null {
  const id = tree().getAttribute('aria-activedescendant');

  return id === null ? null : document.getElementById(id);
}

function toggle(row: HTMLElement): HTMLElement {
  const element = row.querySelector('[aria-hidden="true"]');

  if (!(element instanceof HTMLElement)) {
    throw new Error('The row has no expand toggle');
  }

  return element;
}

async function focusTree() {
  const user = userEvent.setup();
  await user.tab();

  return user;
}

describe('TreeView rendering', () => {
  it('shows the roots with the tree attributes', () => {
    render(<Harness />);

    expect(visibleNames()).toEqual(['World', 'Player', 'Light']);
    expect(tree().getAttribute('aria-multiselectable')).toBe('true');
    expect(item('World').getAttribute('aria-level')).toBe('1');
    expect(item('World').getAttribute('aria-expanded')).toBe('false');
    expect(item('Light').hasAttribute('aria-expanded')).toBe(false);
    expect(item('Player').getAttribute('aria-posinset')).toBe('2');
    expect(item('Player').getAttribute('aria-setsize')).toBe('3');
  });

  it('shows the children of the expanded nodes one level deeper', () => {
    render(<Harness initial={{ expandedIds: ['world', 'props'] }} />);

    expect(visibleNames()).toEqual([
      'World',
      'Terrain',
      'Props',
      'Rock',
      'Tree',
      'Player',
      'Light',
    ]);
    expect(item('World').getAttribute('aria-expanded')).toBe('true');
    expect(item('Rock').getAttribute('aria-level')).toBe('3');
  });

  it('renders only the visible rows of a large tree', () => {
    const groups = Array.from({ length: GROUP_COUNT }, (_, group) => groupId(group));
    render(<Harness model={createLargeTree()} initial={{ expandedIds: groups }} />);

    expect(screen.getAllByRole('treeitem')).toHaveLength(TEST_VISIBLE_ROWS + OVERSCAN_ROWS);
    expect(item(groupId(0)).getAttribute('aria-setsize')).toBe(String(GROUP_COUNT));
  });

  it('asks the model for the icon of the current state', () => {
    const getIcon = vi.fn((_id: string, expanded: boolean) =>
      expanded ? frameworkIcons['folder-open'] : frameworkIcons.folder,
    );
    render(<Harness model={{ ...TEST_TREE, getIcon }} initial={{ expandedIds: ['world'] }} />);

    expect(getIcon).toHaveBeenCalledWith('world', true);
    expect(getIcon).toHaveBeenCalledWith('player', false);
  });

  it('draws a custom row next to the toggle', () => {
    const state = {
      selectedIds: [],
      onSelectedIdsChange: vi.fn(),
      focusedId: null,
      onFocusedIdChange: vi.fn(),
      expandedIds: ['world'],
      onExpandedIdsChange: vi.fn(),
    };
    render(
      <TreeView
        aria-label={TREE_LABEL}
        model={TEST_TREE}
        {...state}
        renderRow={({ label, depth }) => `${label}@${String(depth)}`}
      />,
    );

    expect(item('Terrain@1').getAttribute('aria-level')).toBe('2');
  });
});

describe('TreeView mouse', () => {
  it('expands and collapses a node with its toggle without selecting it', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(toggle(item('World')));

    expect(visibleNames()).toEqual(['World', 'Terrain', 'Props', 'Player', 'Light']);
    expect(selectedNames()).toEqual([]);

    await user.click(toggle(item('World')));

    expect(visibleNames()).toEqual(['World', 'Player', 'Light']);
  });

  it('expands the whole subtree with Alt+click', () => {
    render(<Harness />);

    fireEvent.click(toggle(item('World')), { altKey: true });

    expect(visibleNames()).toEqual([
      'World',
      'Terrain',
      'Props',
      'Rock',
      'Tree',
      'Player',
      'Light',
    ]);
  });

  it('moves the focus to a node that hides the focused row', async () => {
    const user = userEvent.setup();
    render(<Harness initial={{ expandedIds: ['world', 'props'] }} />);

    await user.click(item('Rock'));
    await user.click(toggle(item('World')));

    expect(activeItem()).toBe(item('World'));
    expect(selectedNames()).toEqual([]);
  });

  it('selects a range across the levels with Shift', async () => {
    const user = userEvent.setup();
    render(<Harness initial={{ expandedIds: ['world'] }} />);

    await user.click(item('Terrain'));
    await user.keyboard('{Shift>}');
    await user.click(item('Player'));
    await user.keyboard('{/Shift}');

    expect(selectedNames()).toEqual(['Terrain', 'Props', 'Player']);
  });
});

describe('TreeView keyboard', () => {
  it('expands with Right and then moves to the first child', async () => {
    render(<Harness />);
    const user = await focusTree();

    await user.keyboard('{ArrowRight}');

    expect(item('World').getAttribute('aria-expanded')).toBe('true');
    expect(activeItem()).toBe(item('World'));

    await user.keyboard('{ArrowRight}');

    expect(activeItem()).toBe(item('Terrain'));
    expect(selectedNames()).toEqual(['Terrain']);
  });

  it('moves to the parent with Left and then collapses it', async () => {
    render(<Harness initial={{ expandedIds: ['world'], focusedId: 'props' }} />);
    const user = await focusTree();

    await user.keyboard('{ArrowLeft}');

    expect(activeItem()).toBe(item('World'));
    expect(selectedNames()).toEqual(['World']);

    await user.keyboard('{ArrowLeft}');

    expect(visibleNames()).toEqual(['World', 'Player', 'Light']);
  });

  it('expands and collapses the subtree with Alt and the arrows', async () => {
    render(<Harness />);
    const user = await focusTree();

    await user.keyboard('{Alt>}{ArrowRight}{/Alt}');

    expect(item('Props').getAttribute('aria-expanded')).toBe('true');

    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}{ArrowRight}');

    expect(item('Props').getAttribute('aria-expanded')).toBe('false');
  });

  it('moves through the visible rows with Up and Down', async () => {
    render(<Harness initial={{ expandedIds: ['world'] }} />);
    const user = await focusTree();

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

    expect(selectedNames()).toEqual(['Player']);

    await user.keyboard('{ArrowUp}');

    expect(selectedNames()).toEqual(['Props']);
  });

  it('keeps the selection inside a collapsed node', async () => {
    const user = userEvent.setup();
    render(<Harness initial={{ expandedIds: ['world'], selectedIds: ['terrain'] }} />);

    await user.click(toggle(item('World')));

    expect(selectedNames()).toEqual([]);

    await user.click(toggle(item('World')));

    expect(selectedNames()).toEqual(['Terrain']);
  });
});

function renameField(): HTMLInputElement {
  const element = screen.getByRole('textbox', { name: RENAME_LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('The rename field is not an input');
  }

  return element;
}

function queryRenameField(): HTMLElement | null {
  return screen.queryByRole('textbox', { name: RENAME_LABEL });
}

function selectionLength(input: HTMLInputElement): number {
  return (input.selectionEnd ?? 0) - (input.selectionStart ?? 0);
}

describe('TreeView rename', () => {
  it('starts with F2 on the focused row and selects the name', async () => {
    render(<Harness initial={{ focusedId: 'player' }} onRename={vi.fn()} />);
    const user = await focusTree();

    await user.keyboard('{F2}');

    expect(renameField().value).toBe('Player');
    expect(document.activeElement).toBe(renameField());
    expect(selectionLength(renameField())).toBe('Player'.length);
  });

  it('starts with Enter on macOS instead of F2', async () => {
    render(
      <MacPlatformContext value>
        <Harness initial={{ focusedId: 'player' }} onRename={vi.fn()} />
      </MacPlatformContext>,
    );
    const user = await focusTree();

    await user.keyboard('{F2}');

    expect(queryRenameField()).toBeNull();

    await user.keyboard('{Enter}');

    expect(renameField().value).toBe('Player');
  });

  it('starts with a double click on the label but not on the arrow', async () => {
    const user = userEvent.setup();
    render(<Harness onRename={vi.fn()} />);

    await user.dblClick(toggle(item('World')));

    expect(queryRenameField()).toBeNull();

    const label = item('Light').querySelector('[data-list-row-label]');

    if (label === null) {
      throw new Error('The row has no label');
    }

    await user.dblClick(label);

    expect(renameField().value).toBe('Light');
  });

  it('commits with Enter and returns the focus to the tree', async () => {
    const onRename = vi.fn();
    render(<Harness initial={{ focusedId: 'player' }} onRename={onRename} />);
    const user = await focusTree();

    await user.keyboard('{F2}Hero{Enter}');

    expect(onRename).toHaveBeenCalledExactlyOnceWith('player', 'Hero');
    expect(queryRenameField()).toBeNull();
    expect(document.activeElement).toBe(tree());
  });

  it('cancels with Esc without letting it out of the tree', async () => {
    const onRename = vi.fn();
    const onOuterKeyDown = vi.fn<(key: string) => void>();
    render(
      <div
        onKeyDown={(event) => {
          onOuterKeyDown(event.key);
        }}
      >
        <Harness initial={{ focusedId: 'player' }} onRename={onRename} />
      </div>,
    );
    const user = await focusTree();

    await user.keyboard('{F2}Hero{Escape}');

    expect(onRename).not.toHaveBeenCalled();
    expect(onOuterKeyDown).not.toHaveBeenCalledWith('Escape');
    expect(queryRenameField()).toBeNull();
    expect(document.activeElement).toBe(tree());

    await user.keyboard('{F2}{Escape}');

    expect(onOuterKeyDown).not.toHaveBeenCalledWith('Escape');
    expect(queryRenameField()).toBeNull();
  });

  it('commits when the field loses the focus and leaves the focus there', async () => {
    const onRename = vi.fn();
    render(<Harness initial={{ focusedId: 'player' }} onRename={onRename} />);
    const user = await focusTree();

    await user.keyboard('{F2}Hero');
    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(onRename).toHaveBeenCalledExactlyOnceWith('player', 'Hero');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: OUTSIDE }));
  });

  it('does not rename to the same or to an invalid name', async () => {
    const onRename = vi.fn();
    render(<Harness initial={{ focusedId: 'player' }} onRename={onRename} />);
    const user = await focusTree();

    await user.keyboard('{F2}{Enter}');
    await user.keyboard('{F2}{Backspace}');

    expect(renameField().getAttribute('aria-invalid')).toBe('true');

    await user.keyboard('{Enter}');

    expect(onRename).not.toHaveBeenCalled();
    expect(queryRenameField()).toBeNull();
  });

  it('does not start without a rename handler', async () => {
    render(<Harness initial={{ focusedId: 'player' }} />);
    const user = await focusTree();

    await user.keyboard('{F2}');

    expect(queryRenameField()).toBeNull();
  });
});

describe('TreeView filter', () => {
  it('shows the matches with their expanded ancestors and keeps the owner state', () => {
    const onExpandedIdsChange = vi.fn();
    render(<Harness filter="rock" onExpandedIdsChange={onExpandedIdsChange} />);

    expect(visibleNames()).toEqual(['World', 'Props', 'Rock']);
    expect(item('World').getAttribute('aria-expanded')).toBe('true');
    expect(onExpandedIdsChange).not.toHaveBeenCalled();
  });

  it('highlights the match in the label', () => {
    render(<Harness filter="ro" />);

    expect(item('Rock').querySelector('mark')?.textContent).toBe('Ro');
    expect(item('Props').querySelector('mark')?.textContent).toBe('ro');
    expect(item('World').querySelector('mark')).toBeNull();
  });

  it('collapses inside the results without changing the owner state', async () => {
    const user = userEvent.setup();
    const onExpandedIdsChange = vi.fn();
    render(<Harness filter="rock" onExpandedIdsChange={onExpandedIdsChange} />);

    await user.click(toggle(item('World')));

    expect(visibleNames()).toEqual(['World']);
    expect(onExpandedIdsChange).not.toHaveBeenCalled();
  });

  it('reveals the selected node after the filter is cleared', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness filter="rock" />);

    await user.click(item('Rock'));
    rerender(<Harness filter="" />);

    expect(visibleNames()).toEqual([
      'World',
      'Terrain',
      'Props',
      'Rock',
      'Tree',
      'Player',
      'Light',
    ]);
    expect(activeItem()).toBe(item('Rock'));
    expect(selectedNames()).toEqual(['Rock']);
  });

  it('gets the focus from the search field with Down', async () => {
    function SearchableTree() {
      const [query, setQuery] = useState('rock');
      const treeRef = useRef<HTMLDivElement>(null);
      const state = useTreeViewState();

      return (
        <>
          <SearchField
            label={RESULTS_SEARCH_LABEL}
            clearLabel={RESULTS_CLEAR_LABEL}
            value={query}
            onValueChange={setQuery}
            resultsRef={treeRef}
          />
          <TreeView
            ref={treeRef}
            aria-label={TREE_LABEL}
            model={TEST_TREE}
            filter={query}
            {...state}
          />
        </>
      );
    }

    const user = userEvent.setup();
    render(<SearchableTree />);

    await user.click(screen.getByRole('searchbox', { name: RESULTS_SEARCH_LABEL }));
    await user.keyboard('{ArrowDown}');

    expect(document.activeElement).toBe(tree());
    expect(activeItem()).toBe(item('World'));
  });
});
