import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/ui/button/Button';
import { SearchableMenu } from './SearchableMenu';
import type { SearchableMenuItem } from './searchableMenuModel';

const TRIGGER = 'Add Component';
const MENU_LABEL = 'Component';
const LABELS = { search: 'Search', clearSearch: 'Clear search', back: 'Back' };
const ITEMS: readonly SearchableMenuItem[] = [
  {
    id: 'physics',
    label: 'Physics',
    children: [
      { id: 'rigidbody', label: 'Rigidbody', disabled: true },
      { id: 'collider', label: 'Box Collider' },
    ],
  },
  { id: 'rendering', label: 'Rendering', children: [{ id: 'light', label: 'Light' }] },
  { id: 'note', label: 'Note' },
];

function Harness({ onSelect = vi.fn() }: { readonly onSelect?: (id: string) => void }) {
  return (
    <SearchableMenu
      label={MENU_LABEL}
      items={ITEMS}
      labels={LABELS}
      onSelect={onSelect}
      trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER}</Button>}
    />
  );
}

function search(): HTMLElement {
  return screen.getByRole('combobox', { name: LABELS.search });
}

function activeName(): string | null {
  const id = search().getAttribute('aria-activedescendant');

  return id === null ? null : (document.getElementById(id)?.textContent ?? null);
}

function title(): string | null {
  return screen.getByRole('listbox').getAttribute('aria-label');
}

async function openMenu() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: TRIGGER }));
  await waitFor(() => {
    expect(document.activeElement).toBe(search());
  });

  return user;
}

afterEach(cleanup);

describe('SearchableMenu', () => {
  it('opens with the focus in the search and the first row active', async () => {
    await openMenu();

    expect(title()).toBe(MENU_LABEL);
    expect(activeName()).toBe('Physics');
    expect(search().getAttribute('aria-expanded')).toBe('true');
  });

  it('moves with the arrows without leaving the search and enters a group with Right', async () => {
    const user = await openMenu();

    await user.keyboard('{ArrowDown}');

    expect(activeName()).toBe('Rendering');
    expect(document.activeElement).toBe(search());

    await user.keyboard('{ArrowRight}');

    expect(title()).toBe('Rendering');
    expect(activeName()).toBe('Light');
  });

  it('goes back with Left, Backspace and the back button', async () => {
    const user = await openMenu();

    await user.keyboard('{Enter}');

    expect(title()).toBe('Physics');
    expect(activeName()).toBe('Box Collider');

    await user.keyboard('{ArrowLeft}');

    expect(title()).toBe(MENU_LABEL);

    await user.keyboard('{Enter}{Backspace}');

    expect(title()).toBe(MENU_LABEL);

    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: LABELS.back }));

    expect(title()).toBe(MENU_LABEL);
  });

  it('shows a flat list of matches with their path while searching', async () => {
    const user = await openMenu();

    await user.keyboard('li');

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Box ColliderPhysics',
      'LightRendering',
    ]);
    expect(activeName()).toBe('Box ColliderPhysics');
  });

  it('chooses an item with Enter or a click and closes', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));
    await waitFor(() => {
      expect(document.activeElement).toBe(search());
    });

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('note');
    expect(screen.queryByRole('listbox')).toBeNull();

    await user.click(screen.getByRole('button', { name: TRIGGER }));
    await user.click(await screen.findByRole('option', { name: 'Rendering' }));
    await user.click(screen.getByRole('option', { name: 'Light' }));

    expect(onSelect).toHaveBeenLastCalledWith('light');
  });

  it('skips and does not choose disabled items', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Harness onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: TRIGGER }));
    await user.click(await screen.findByRole('option', { name: 'Physics' }));
    await user.click(screen.getByRole('option', { name: 'Rigidbody' }));

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('option', { name: 'Rigidbody' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
  });
});
