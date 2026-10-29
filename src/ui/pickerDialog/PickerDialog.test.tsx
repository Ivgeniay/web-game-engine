import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { installVirtualListEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { PickerDialog } from './PickerDialog';
import type { PickerTab } from './PickerDialog';
import { filterPickerItems } from './pickerItems';

const LABELS = {
  search: 'Search',
  clearSearch: 'Clear search',
  tabs: 'Source',
  view: 'View',
  listView: 'List',
  gridView: 'Grid',
  scale: 'Icon size',
  results: 'Results',
  none: 'None',
  select: 'Select',
  cancel: 'Cancel',
};
const NAMES: Readonly<Record<string, string>> = {
  rock: 'Rock.mat',
  ground: 'Ground.mat',
  player: 'Player',
};
const TABS: readonly PickerTab[] = [
  { id: 'assets', label: 'Assets', getItemIds: () => ['rock', 'ground'] },
  { id: 'scene', label: 'Scene', getItemIds: () => ['player'] },
];
const GRID_WIDTH = 400;
const VALUE_LABEL = 'Value';
const TITLE = 'Select material';

function nameOf(id: string): string {
  return NAMES[id] ?? id;
}

interface HarnessProps {
  readonly initial?: string | null;
  readonly onValueChange?: ValueChangeHandler<string | null>;
  readonly onClose?: () => void;
}

function Harness({ initial = 'rock', onValueChange, onClose }: HarnessProps) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(true);

  return (
    <>
      <output aria-label={VALUE_LABEL}>{value ?? ''}</output>
      <PickerDialog
        open={open}
        title={TITLE}
        value={value}
        tabs={TABS}
        getLabel={nameOf}
        labels={LABELS}
        onValueChange={(next, phase) => {
          setValue(next);
          onValueChange?.(next, phase);
        }}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
      />
    </>
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
});

afterEach(() => {
  cleanup();
  environment.restore();
});

function search(): HTMLElement {
  return screen.getByRole('searchbox', { name: LABELS.search });
}

function optionNames(): readonly string[] {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

async function openPicker(props: HarnessProps = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await waitFor(() => {
    expect(document.activeElement).toBe(search());
  });

  return user;
}

describe('filterPickerItems', () => {
  it('puts None first without a query and filters by the label with a query', () => {
    expect(filterPickerItems(['rock', 'ground'], '', nameOf, 'en')).toHaveLength(3);
    expect(filterPickerItems(['rock', 'ground'], 'GRO', nameOf, 'en')).toEqual(['ground']);
  });
});

describe('PickerDialog', () => {
  it('opens with the focus in the search and shows None and the items of the first tab', async () => {
    await openPicker();

    expect(screen.getByRole('dialog', { name: TITLE })).toBeDefined();
    expect(optionNames()).toEqual(['None', 'Rock.mat', 'Ground.mat']);
    expect(screen.getByRole('option', { name: 'Rock.mat' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('filters the items by the search query', async () => {
    const user = await openPicker();

    await user.type(search(), 'gro');

    expect(optionNames()).toEqual(['Ground.mat']);
  });

  it('previews a clicked item and chooses it with Enter', async () => {
    const onValueChange = vi.fn();
    const onClose = vi.fn();
    const user = await openPicker({ onValueChange, onClose });

    await user.click(screen.getByRole('option', { name: 'Ground.mat' }));

    expect(onValueChange).toHaveBeenLastCalledWith('ground', 'preview');

    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith('ground', 'commit');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('chooses an item with a double click', async () => {
    const onValueChange = vi.fn();
    const user = await openPicker({ onValueChange });

    await user.dblClick(screen.getByRole('option', { name: 'None' }));

    expect(onValueChange).toHaveBeenLastCalledWith(null, 'commit');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('returns the value it was opened with on Esc', async () => {
    const onValueChange = vi.fn();
    const user = await openPicker({ onValueChange });

    await user.click(screen.getByRole('option', { name: 'Ground.mat' }));
    await user.keyboard('{Escape}');

    expect(onValueChange).toHaveBeenLastCalledWith('rock', 'cancel');
    expect(screen.getByRole('status', { name: VALUE_LABEL }).textContent).toBe('rock');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('returns the value it was opened with on Cancel', async () => {
    const onValueChange = vi.fn();
    const user = await openPicker({ onValueChange });

    await user.click(screen.getByRole('option', { name: 'None' }));
    await user.click(screen.getByRole('button', { name: LABELS.cancel }));

    expect(onValueChange).toHaveBeenLastCalledWith('rock', 'cancel');
  });

  it('switches the source tab and the view', async () => {
    const user = await openPicker();

    await user.click(screen.getByRole('button', { name: 'Scene' }));

    expect(optionNames()).toEqual(['None', 'Player']);
    expect(screen.getByRole('slider', { name: LABELS.scale })).toBeDefined();

    await user.click(screen.getByRole('button', { name: LABELS.listView }));

    expect(screen.getByRole('option', { name: 'Player' }).style.transform).toBe('translateY(20px)');
    expect(screen.queryByRole('slider', { name: LABELS.scale })).toBeNull();
  });
});
