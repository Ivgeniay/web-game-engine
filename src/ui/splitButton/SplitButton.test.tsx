import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '@/ui/menu/menuItems';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { SplitButton } from './SplitButton';

const LABEL = 'Build';
const MENU_LABEL = 'Build options';
const TOOLBAR_LABEL = 'Tools';

interface HarnessProps {
  readonly onBuild: () => void;
  readonly onClean: () => void;
  readonly disabled?: boolean;
}

function Harness({ onBuild, onClean, disabled }: HarnessProps) {
  const items: readonly MenuItem[] = [
    { kind: 'action', id: 'clean', label: 'Clean build', onSelect: onClean },
    { kind: 'action', id: 'run', label: 'Build and run', onSelect: vi.fn() },
  ];

  return (
    <SplitButton
      label={LABEL}
      onClick={onBuild}
      menuLabel={MENU_LABEL}
      menuItems={items}
      disabled={disabled}
    />
  );
}

function mainButton(): HTMLElement {
  return screen.getByRole('button', { name: LABEL });
}

function arrowButton(): HTMLElement {
  return screen.getByRole('button', { name: MENU_LABEL });
}

afterEach(() => {
  cleanup();
});

describe('SplitButton', () => {
  it('runs the main action on click without opening the menu', async () => {
    const user = userEvent.setup();
    const onBuild = vi.fn();
    render(<Harness onBuild={onBuild} onClean={vi.fn()} />);

    await user.click(mainButton());

    expect(onBuild).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens the variants from the arrow and runs one', async () => {
    const user = userEvent.setup();
    const onBuild = vi.fn();
    const onClean = vi.fn();
    render(<Harness onBuild={onBuild} onClean={onClean} />);

    expect(arrowButton().getAttribute('aria-haspopup')).toBe('menu');

    await user.click(arrowButton());
    await user.click(screen.getByRole('menuitem', { name: 'Clean build' }));

    expect(onClean).toHaveBeenCalledOnce();
    expect(onBuild).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens the menu with Alt+ArrowDown on the main part and returns the focus there', async () => {
    const user = userEvent.setup();
    render(<Harness onBuild={vi.fn()} onClean={vi.fn()} />);

    mainButton().focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Clean build' }));
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.activeElement).toBe(mainButton());
    });
  });

  it('is two Tab stops', async () => {
    const user = userEvent.setup();
    render(<Harness onBuild={vi.fn()} onClean={vi.fn()} />);

    await user.tab();

    expect(document.activeElement).toBe(mainButton());

    await user.tab();

    expect(document.activeElement).toBe(arrowButton());
  });

  it('is two roving stops inside a toolbar', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <Harness onBuild={vi.fn()} onClean={vi.fn()} />
      </Toolbar>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(arrowButton());
  });

  it('disables both parts', async () => {
    const user = userEvent.setup();
    const onBuild = vi.fn();
    render(<Harness onBuild={onBuild} onClean={vi.fn()} disabled />);

    await user.click(mainButton());
    await user.click(arrowButton());

    expect(onBuild).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(mainButton().hasAttribute('disabled')).toBe(true);
    expect(arrowButton().hasAttribute('disabled')).toBe(true);
  });
});
