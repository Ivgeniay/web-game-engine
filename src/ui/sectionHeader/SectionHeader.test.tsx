import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '@/contracts/menu';
import { SectionHeader } from './SectionHeader';

const LABEL = 'Shadows';
const NESTED = 'Cascades';
const CONTENT = 'Strength';
const MENU_LABEL = 'Shadows menu';
const RESET = 'Reset';

interface HarnessProps {
  readonly label?: string;
  readonly initial?: boolean;
  readonly disabled?: boolean;
  readonly menuItems?: readonly MenuItem[];
  readonly children?: ReactNode;
}

function Harness({
  label = LABEL,
  initial = true,
  disabled,
  menuItems,
  children = CONTENT,
}: HarnessProps) {
  const [expanded, setExpanded] = useState(initial);
  const menu = menuItems === undefined ? {} : { menuItems, menuLabel: MENU_LABEL };

  return (
    <SectionHeader
      label={label}
      expanded={expanded}
      onExpandedChange={setExpanded}
      disabled={disabled}
      {...menu}
    >
      {children}
    </SectionHeader>
  );
}

function header(name = LABEL): HTMLElement {
  return screen.getByRole('button', { name, hidden: true });
}

function contentOf(name = LABEL): HTMLElement {
  const content = document.getElementById(header(name).getAttribute('aria-controls') ?? '');

  if (content === null) {
    throw new Error(`Section ${name} has no content`);
  }

  return content;
}

afterEach(cleanup);

describe('SectionHeader', () => {
  it('shows the content while expanded and keeps it mounted while collapsed', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(header().getAttribute('aria-expanded')).toBe('true');
    expect(contentOf().hidden).toBe(false);

    await user.click(header());

    expect(header().getAttribute('aria-expanded')).toBe('false');
    expect(contentOf().hidden).toBe(true);
    expect(contentOf().textContent).toBe(CONTENT);
  });

  it('collapses with the left arrow and expands with the right arrow', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    header().focus();
    await user.keyboard('{ArrowLeft}');

    expect(header().getAttribute('aria-expanded')).toBe('false');

    await user.keyboard('{ArrowRight}');

    expect(header().getAttribute('aria-expanded')).toBe('true');
  });

  it('changes nested sections too on Alt+click', async () => {
    const user = userEvent.setup();
    render(
      <Harness>
        <Harness label={NESTED} />
      </Harness>,
    );

    await user.keyboard('{Alt>}');
    await user.click(header());
    await user.keyboard('{/Alt}');

    expect(header().getAttribute('aria-expanded')).toBe('false');
    expect(header(NESTED).getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the section menu from its button', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness menuItems={[{ kind: 'action', id: 'reset', label: RESET, onSelect }]} />);

    await user.click(screen.getByRole('button', { name: MENU_LABEL }));
    await user.click(await screen.findByRole('menuitem', { name: RESET }));

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('does not react when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);

    await user.click(header());

    expect(header().getAttribute('aria-expanded')).toBe('true');
    expect(header().hasAttribute('disabled')).toBe(true);
  });
});
