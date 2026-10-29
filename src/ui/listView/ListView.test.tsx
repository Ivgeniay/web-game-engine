import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MacPlatformContext } from '@/ui/platform/macPlatformContext';
import {
  TEST_ROW_HEIGHT,
  TEST_VISIBLE_ROWS,
  installVirtualListEnvironment,
} from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { OVERSCAN_ROWS } from '@/ui/virtualList/virtualRange';
import { ListView } from './ListView';
import type { ListSelectionMode } from './listSelection';
import { useListViewState } from './useListViewState';
import type { ListViewInitialState } from './useListViewState';

const LIST_LABEL = 'Assets';
const OUTSIDE = 'Outside';
const LARGE_COUNT = 10_000;
const SCROLLED_ROW = 5000;

const FRUITS: Readonly<Record<string, string>> = {
  apple: 'Apple',
  apricot: 'Apricot',
  banana: 'Banana',
  cherry: 'Cherry',
  date: 'Date',
};

const FRUIT_IDS = Object.keys(FRUITS);
const LARGE_IDS = Array.from({ length: LARGE_COUNT }, (_, index) => `item-${String(index)}`);

function fruitLabel(id: string): string {
  return FRUITS[id] ?? id;
}

function largeLabel(id: string): string {
  return id.replace('item-', 'Item ');
}

interface HarnessProps {
  readonly itemIds?: readonly string[];
  readonly getLabel?: (id: string) => string;
  readonly selectionMode?: ListSelectionMode;
  readonly initial?: ListViewInitialState;
  readonly onSelectedIdsChange?: (ids: readonly string[]) => void;
}

function Harness({
  itemIds = FRUIT_IDS,
  getLabel = fruitLabel,
  selectionMode = 'multiple',
  initial,
  onSelectedIdsChange,
}: HarnessProps) {
  const state = useListViewState(initial);

  return (
    <>
      <ListView
        aria-label={LIST_LABEL}
        itemIds={itemIds}
        getLabel={getLabel}
        selectionMode={selectionMode}
        {...state}
        onSelectedIdsChange={(ids) => {
          state.onSelectedIdsChange(ids);
          onSelectedIdsChange?.(ids);
        }}
      />
      <button type="button">{OUTSIDE}</button>
    </>
  );
}

let environment: VirtualListTestEnvironment;

beforeEach(() => {
  environment = installVirtualListEnvironment();
});

afterEach(() => {
  cleanup();
  environment.restore();
});

function list(): HTMLElement {
  return screen.getByRole('listbox', { name: LIST_LABEL });
}

function row(name: string): HTMLElement {
  return screen.getByRole('option', { name });
}

function selectedNames(): readonly string[] {
  return screen.getAllByRole('option', { selected: true }).map((option) => option.textContent);
}

function activeRow(): HTMLElement | null {
  const id = list().getAttribute('aria-activedescendant');

  return id === null ? null : document.getElementById(id);
}

async function focusList() {
  const user = userEvent.setup();
  await user.tab();

  return user;
}

describe('ListView rendering', () => {
  it('renders only the visible rows and the overscan of a large list', () => {
    render(<Harness itemIds={LARGE_IDS} getLabel={largeLabel} />);

    expect(screen.getAllByRole('option')).toHaveLength(TEST_VISIBLE_ROWS + OVERSCAN_ROWS);
    expect(row('Item 0').getAttribute('aria-setsize')).toBe(String(LARGE_COUNT));
    expect(row('Item 0').getAttribute('aria-posinset')).toBe('1');
  });

  it('renders the rows of the scrolled position', () => {
    render(<Harness itemIds={LARGE_IDS} getLabel={largeLabel} />);

    environment.setScrollTop(SCROLLED_ROW * TEST_ROW_HEIGHT);
    fireEvent.scroll(list());

    expect(row(`Item ${String(SCROLLED_ROW)}`).getAttribute('aria-posinset')).toBe(
      String(SCROLLED_ROW + 1),
    );
    expect(screen.queryByRole('option', { name: 'Item 0' })).toBeNull();
  });

  it('marks the multiple mode and keeps a single tab stop', () => {
    render(<Harness />);

    expect(list().getAttribute('aria-multiselectable')).toBe('true');
    expect(list().tabIndex).toBe(0);
    expect(row('Apple').hasAttribute('tabindex')).toBe(false);
  });

  it('draws a custom row', () => {
    render(
      <ListView
        aria-label={LIST_LABEL}
        itemIds={FRUIT_IDS}
        getLabel={fruitLabel}
        selectedIds={['banana']}
        onSelectedIdsChange={vi.fn()}
        focusedId={null}
        onFocusedIdChange={vi.fn()}
        renderRow={({ label, selected, index }) =>
          `${String(index)}:${label}:${selected ? 'on' : 'off'}`
        }
      />,
    );

    expect(row('2:Banana:on').getAttribute('aria-selected')).toBe('true');
    expect(row('0:Apple:off').getAttribute('aria-selected')).toBe('false');
  });
});

describe('ListView mouse', () => {
  it('selects the clicked row and focuses the list', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(row('Banana'));

    expect(selectedNames()).toEqual(['Banana']);
    expect(document.activeElement).toBe(list());
    expect(activeRow()).toBe(row('Banana'));
  });

  it('adds with Ctrl and selects a range with Shift', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(row('Apple'));
    await user.keyboard('{Control>}');
    await user.click(row('Date'));
    await user.keyboard('{/Control}');

    expect(selectedNames()).toEqual(['Apple', 'Date']);

    await user.keyboard('{Shift>}');
    await user.click(row('Banana'));
    await user.keyboard('{/Shift}');

    expect(selectedNames()).toEqual(['Banana', 'Cherry', 'Date']);
  });

  it('uses Command instead of Ctrl on macOS', async () => {
    const user = userEvent.setup();
    render(
      <MacPlatformContext value>
        <Harness />
      </MacPlatformContext>,
    );

    await user.click(row('Apple'));
    await user.keyboard('{Meta>}');
    await user.click(row('Cherry'));
    await user.keyboard('{/Meta}');

    expect(selectedNames()).toEqual(['Apple', 'Cherry']);
  });

  it('clears the selection on a click on the empty space', async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <Harness initial={{ selectedIds: ['apple'] }} onSelectedIdsChange={onSelectedIdsChange} />,
    );

    await user.click(list());

    expect(onSelectedIdsChange).toHaveBeenCalledWith([]);
    expect(screen.queryAllByRole('option', { selected: true })).toEqual([]);
  });

  it('selects an unselected row on a right click and keeps a selected one', () => {
    render(<Harness initial={{ selectedIds: ['apple', 'banana'] }} />);

    fireEvent.contextMenu(row('Banana'));

    expect(selectedNames()).toEqual(['Apple', 'Banana']);
    expect(activeRow()).toBe(row('Banana'));

    fireEvent.contextMenu(row('Date'));

    expect(selectedNames()).toEqual(['Date']);
  });

  it('ignores the modifiers in the single mode', async () => {
    const user = userEvent.setup();
    render(<Harness selectionMode="single" />);

    await user.click(row('Apple'));
    await user.keyboard('{Control>}');
    await user.click(row('Date'));
    await user.keyboard('{/Control}');

    expect(selectedNames()).toEqual(['Date']);
    expect(list().hasAttribute('aria-multiselectable')).toBe(false);
  });
});

describe('ListView keyboard', () => {
  it('focuses the first selected row when the list gets the focus', async () => {
    render(<Harness initial={{ selectedIds: ['cherry'] }} />);

    await focusList();

    expect(activeRow()).toBe(row('Cherry'));
  });

  it('focuses the first row without a selection and does not select it', async () => {
    render(<Harness />);

    await focusList();

    expect(activeRow()).toBe(row('Apple'));
    expect(screen.queryAllByRole('option', { selected: true })).toEqual([]);
  });

  it('moves and selects with the arrows, Home and End', async () => {
    render(<Harness />);
    const user = await focusList();

    await user.keyboard('{ArrowDown}');
    expect(selectedNames()).toEqual(['Apricot']);

    await user.keyboard('{End}');
    expect(selectedNames()).toEqual(['Date']);

    await user.keyboard('{Home}{ArrowUp}');
    expect(selectedNames()).toEqual(['Apple']);
    expect(activeRow()).toBe(row('Apple'));
  });

  it('extends the selection with Shift', async () => {
    render(<Harness />);
    const user = await focusList();

    await user.keyboard('{ArrowDown}{Shift>}{ArrowDown}{ArrowDown}{/Shift}');

    expect(selectedNames()).toEqual(['Apricot', 'Banana', 'Cherry']);
  });

  it('moves the focus without selecting with Ctrl and toggles with Ctrl+Space', async () => {
    render(<Harness initial={{ selectedIds: ['apple'], focusedId: 'apple' }} />);
    const user = await focusList();

    await user.keyboard('{Control>}{ArrowDown}{ArrowDown}{/Control}');

    expect(activeRow()).toBe(row('Banana'));
    expect(selectedNames()).toEqual(['Apple']);

    await user.keyboard('{Control>} {/Control}');

    expect(selectedNames()).toEqual(['Apple', 'Banana']);
  });

  it('selects everything with Ctrl+A only in the multiple mode', async () => {
    render(<Harness />);
    const user = await focusList();

    await user.keyboard('{Control>}a{/Control}');

    expect(selectedNames()).toHaveLength(FRUIT_IDS.length);

    cleanup();
    render(<Harness selectionMode="single" initial={{ selectedIds: ['date'] }} />);
    const singleUser = await focusList();

    await singleUser.keyboard('{Control>}a{/Control}');

    expect(selectedNames()).toEqual(['Date']);
  });

  it('jumps to a row by its first letters', async () => {
    render(<Harness />);
    const user = await focusList();

    await user.keyboard('ch');

    expect(selectedNames()).toEqual(['Cherry']);
  });

  it('moves to the next row on the same letter', async () => {
    render(<Harness initial={{ focusedId: 'apple' }} />);
    const user = await focusList();

    await user.keyboard('a');

    expect(selectedNames()).toEqual(['Apricot']);

    await user.keyboard('a');

    expect(selectedNames()).toEqual(['Apple']);
  });

  it('scrolls to the focused row and keeps it rendered', async () => {
    render(<Harness itemIds={LARGE_IDS} getLabel={largeLabel} />);
    const user = await focusList();

    await user.keyboard('{End}');
    const lastLabel = `Item ${String(LARGE_COUNT - 1)}`;

    expect(environment.getScrollTop()).toBe((LARGE_COUNT - TEST_VISIBLE_ROWS) * TEST_ROW_HEIGHT);

    act(() => {
      environment.setScrollTop(0);
      fireEvent.scroll(list());
    });

    expect(activeRow()).toBe(row(lastLabel));
  });

  it('leaves the list with Tab', async () => {
    render(<Harness />);
    const user = await focusList();

    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: OUTSIDE }));
  });
});
