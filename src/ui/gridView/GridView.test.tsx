import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { useListViewState } from '@/ui/listView/useListViewState';
import { installVirtualListEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { GridView } from './GridView';
import { GRID_CELL_SIZE_MIN } from './gridScale';

const GRID_LABEL = 'Assets';
const CELL_SIZE = 64;
const CELL_PADDING = 4;
const GRID_WIDTH = 400;
const COLUMNS = 5;
const ITEM_COUNT = 12;
const LARGE_COUNT = 10_000;
const PADDING_TOKEN = '--size-list-cell-padding';

function idsOf(count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => `asset-${String(index)}`);
}

function labelOf(id: string): string {
  return id.replace('asset-', 'Asset ');
}

interface HarnessProps {
  readonly itemIds?: readonly string[];
  readonly cellSize?: number;
  readonly loadThumbnail?: ThumbnailLoader;
}

function Harness({
  itemIds = idsOf(ITEM_COUNT),
  cellSize = CELL_SIZE,
  loadThumbnail,
}: HarnessProps) {
  const state = useListViewState();

  return (
    <GridView
      aria-label={GRID_LABEL}
      itemIds={itemIds}
      getLabel={labelOf}
      cellSize={cellSize}
      loadThumbnail={loadThumbnail}
      selectionMode="multiple"
      {...state}
    />
  );
}

let environment: VirtualListTestEnvironment;

beforeEach(() => {
  environment = installVirtualListEnvironment();
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.getAttribute('role') === 'listbox' ? GRID_WIDTH : 0;
  });
  document.documentElement.style.setProperty(PADDING_TOKEN, `${String(CELL_PADDING)}px`);
});

afterEach(() => {
  cleanup();
  environment.restore();
  document.documentElement.style.removeProperty(PADDING_TOKEN);
});

function grid(): HTMLElement {
  return screen.getByRole('listbox', { name: GRID_LABEL });
}

function selectedNames(): readonly string[] {
  return screen.getAllByRole('option', { selected: true }).map((option) => option.textContent);
}

async function focusGrid() {
  const user = userEvent.setup();
  await user.tab();

  return user;
}

describe('GridView', () => {
  it('lays the items out in cells and rows', () => {
    render(<Harness />);
    const sixth = screen.getByRole('option', { name: 'Asset 6' });

    expect(grid().getAttribute('tabindex')).toBe('0');
    expect(sixth.style.transform).toBe('translate(72px, 92px)');
    expect(sixth.style.width).toBe('72px');
  });

  it('moves the focus with the arrows in all directions', async () => {
    render(<Harness />);
    const user = await focusGrid();

    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(selectedNames()).toEqual(['Asset 2']);

    await user.keyboard('{ArrowDown}');

    expect(selectedNames()).toEqual([`Asset ${String(2 + COLUMNS)}`]);

    await user.keyboard('{ArrowDown}');

    expect(selectedNames()).toEqual(['Asset 11']);

    await user.keyboard('{ArrowUp}{ArrowLeft}');

    expect(selectedNames()).toEqual(['Asset 5']);
  });

  it('extends the selection with Shift and the arrows', async () => {
    render(<Harness />);
    const user = await focusGrid();

    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

    expect(selectedNames()).toEqual([
      'Asset 0',
      'Asset 1',
      'Asset 2',
      'Asset 3',
      'Asset 4',
      'Asset 5',
    ]);
  });

  it('selects a cell with a click and more cells with Mod+click', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('option', { name: 'Asset 3' }));
    await user.keyboard('{Control>}');
    await user.click(screen.getByRole('option', { name: 'Asset 7' }));
    await user.keyboard('{/Control}');

    expect(selectedNames()).toEqual(['Asset 3', 'Asset 7']);
  });

  it('becomes a list at the smallest scale', async () => {
    render(<Harness cellSize={GRID_CELL_SIZE_MIN} />);
    const user = await focusGrid();

    expect(screen.getByRole('option', { name: 'Asset 1' }).style.transform).toBe(
      'translateY(20px)',
    );

    await user.keyboard('{ArrowDown}{ArrowRight}');

    expect(selectedNames()).toEqual(['Asset 1']);
  });

  it('loads the previews of the drawn cells', async () => {
    const loadThumbnail = vi.fn<ThumbnailLoader>(() => Promise.resolve('data:image/png;base64,a'));
    render(<Harness itemIds={idsOf(2)} loadThumbnail={loadThumbnail} />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(loadThumbnail.mock.calls.map(([id]) => id)).toEqual(['asset-0', 'asset-1']);
    expect(screen.getByRole('option', { name: 'Asset 0' }).querySelector('img')).not.toBeNull();
  });

  it('draws only the visible rows of a large grid', () => {
    render(<Harness itemIds={idsOf(LARGE_COUNT)} />);

    expect(screen.getAllByRole('option').length).toBeLessThan(LARGE_COUNT / 100);
  });
});
