import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Foldout } from '@/ui/foldout/Foldout';
import type { MenuItem } from '@/ui/menu/menuItems';
import { ComponentHeader } from './ComponentHeader';

const TITLE = 'Rigidbody';
const ENABLED_LABEL = 'Enable Rigidbody';
const HELP_LABEL = 'Open the Rigidbody help';
const MENU_LABEL = 'Rigidbody menu';
const RESET_LABEL = 'Reset';
const NESTED_LABEL = 'Constraints';
const CONTENT = 'Mass';

interface HarnessProps {
  readonly onReset?: () => void;
  readonly onHelp?: () => void;
  readonly onEnabledChange?: (enabled: boolean) => void;
}

function Harness({ onReset = vi.fn(), onHelp = vi.fn(), onEnabledChange }: HarnessProps) {
  const [expanded, setExpanded] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [nestedExpanded, setNestedExpanded] = useState(false);
  const menuItems: readonly MenuItem[] = [
    { kind: 'action', id: 'reset', label: RESET_LABEL, onSelect: onReset },
  ];

  return (
    <ComponentHeader
      title={TITLE}
      icon={frameworkIcons.settings}
      expanded={expanded}
      onExpandedChange={setExpanded}
      enabled={enabled}
      enabledLabel={ENABLED_LABEL}
      onEnabledChange={(next) => {
        setEnabled(next);
        onEnabledChange?.(next);
      }}
      helpLabel={HELP_LABEL}
      onHelp={onHelp}
      menuItems={menuItems}
      menuLabel={MENU_LABEL}
    >
      <Foldout label={NESTED_LABEL} expanded={nestedExpanded} onExpandedChange={setNestedExpanded}>
        {CONTENT}
      </Foldout>
    </ComponentHeader>
  );
}

afterEach(cleanup);

function toggle(): HTMLElement {
  return screen.getByRole('button', { name: TITLE, hidden: true });
}

function isExpanded(element: HTMLElement): boolean {
  return element.getAttribute('aria-expanded') === 'true';
}

function nested(): HTMLElement {
  return screen.getByRole('button', { name: NESTED_LABEL, hidden: true });
}

describe('ComponentHeader', () => {
  it('names the toggle with the title and links it to the content', () => {
    render(<Harness />);

    const contentId = toggle().getAttribute('aria-controls');

    expect(isExpanded(toggle())).toBe(true);
    expect(contentId === null ? null : document.getElementById(contentId)?.hidden).toBe(false);
  });

  it('collapses with the toggle and with a click on the title', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(toggle());

    expect(isExpanded(toggle())).toBe(false);

    await user.click(screen.getByText(TITLE));

    expect(isExpanded(toggle())).toBe(true);
  });

  it('expands the nested sections with Alt+click', () => {
    render(<Harness />);

    fireEvent.click(toggle());
    fireEvent.click(toggle(), { altKey: true });

    expect(isExpanded(toggle())).toBe(true);
    expect(isExpanded(nested())).toBe(true);
  });

  it('switches the component without collapsing it', async () => {
    const user = userEvent.setup();
    const onEnabledChange = vi.fn();
    render(<Harness onEnabledChange={onEnabledChange} />);

    await user.click(screen.getByRole('checkbox', { name: ENABLED_LABEL }));

    expect(onEnabledChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(isExpanded(toggle())).toBe(true);
  });

  it('keeps the toggle, the checkbox and the buttons as separate Tab stops', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(document.activeElement).toBe(toggle());
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: ENABLED_LABEL }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: HELP_LABEL }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: MENU_LABEL }));
  });

  it('collapses and expands with the arrows on the toggle', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.keyboard('{ArrowLeft}');

    expect(isExpanded(toggle())).toBe(false);

    await user.keyboard('{ArrowRight}');

    expect(isExpanded(toggle())).toBe(true);
  });

  it('runs the help action', async () => {
    const user = userEvent.setup();
    const onHelp = vi.fn();
    render(<Harness onHelp={onHelp} />);

    await user.click(screen.getByRole('button', { name: HELP_LABEL }));

    expect(onHelp).toHaveBeenCalledOnce();
    expect(isExpanded(toggle())).toBe(true);
  });

  it('opens the menu from its button without collapsing', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<Harness onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: MENU_LABEL }));
    await user.click(await screen.findByRole('menuitem', { name: RESET_LABEL }));

    expect(onReset).toHaveBeenCalledOnce();
    expect(isExpanded(toggle())).toBe(true);
  });

  it('opens the same menu with a right click on the header', async () => {
    render(<Harness />);

    fireEvent.contextMenu(screen.getByText(TITLE), { button: 2, clientX: 40, clientY: 10 });

    expect(await screen.findByRole('menuitem', { name: RESET_LABEL })).toBeDefined();
  });

  it('opens the menu with Shift+F10 and returns the focus after Esc', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.keyboard('{Shift>}{F10}{/Shift}');

    const item = await screen.findByRole('menuitem', { name: RESET_LABEL });
    await waitFor(() => {
      expect(document.activeElement).toBe(item);
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.activeElement).toBe(toggle());
    });
  });
});
