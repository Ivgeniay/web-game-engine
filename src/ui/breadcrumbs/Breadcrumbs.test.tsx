import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

const LABEL = 'Folder path';
const MORE = 'Show hidden folders';
const ITEMS = [
  { id: 'assets', label: 'Assets' },
  { id: 'models', label: 'Models' },
  { id: 'props', label: 'Props' },
  { id: 'rocks', label: 'Rocks' },
];
const CRUMB_WIDTH = 80;

let availableWidth = 1000;

class ImmediateResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    this.callback([], this);
  }

  unobserve(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

beforeEach(() => {
  availableWidth = 1000;
  vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ width: CRUMB_WIDTH }),
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => availableWidth);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function navigation(): HTMLElement {
  return screen.getByRole('navigation', { name: LABEL });
}

function crumbNames(): readonly string[] {
  return within(navigation())
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label') ?? button.textContent);
}

function show(onNavigate = vi.fn()) {
  render(<Breadcrumbs label={LABEL} items={ITEMS} moreLabel={MORE} onNavigate={onNavigate} />);

  return onNavigate;
}

describe('Breadcrumbs', () => {
  it('shows every level and marks the last one as the current location', () => {
    show();

    expect(crumbNames()).toEqual(['Assets', 'Models', 'Props', 'Rocks']);
    expect(screen.getByRole('button', { name: 'Rocks' }).getAttribute('aria-current')).toBe(
      'location',
    );
  });

  it('goes to a level on click', async () => {
    const user = userEvent.setup();
    const onNavigate = show();

    await user.click(screen.getByRole('button', { name: 'Models' }));

    expect(onNavigate).toHaveBeenCalledExactlyOnceWith('models');
  });

  it('is one Tab stop with the arrows between the levels', async () => {
    const user = userEvent.setup();
    show();

    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Assets' }));

    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Models' }));

    await user.tab();

    expect(navigation().contains(document.activeElement)).toBe(false);
  });

  it('collapses the middle levels into a menu when they do not fit', async () => {
    const user = userEvent.setup();
    availableWidth = CRUMB_WIDTH * 3;
    const onNavigate = show();

    expect(crumbNames()).toEqual(['Assets', MORE, 'Rocks']);

    await user.click(screen.getByRole('button', { name: MORE }));
    await user.click(await screen.findByRole('menuitem', { name: 'Props' }));

    expect(onNavigate).toHaveBeenCalledExactlyOnceWith('props');
  });
});
