import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/ui/button/Button';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { Popover } from './Popover';

type Shading = 'shaded' | 'wireframe';

const PANEL_LABEL = 'View settings';
const TRIGGER = 'View';
const OUTSIDE = 'Outside';
const GRID = 'Show grid';
const APPLY = 'Apply';
const SHADING_LABEL = 'Shading';

const SHADING_OPTIONS: readonly SelectEntry<Shading>[] = [
  { kind: 'option', value: 'shaded', label: 'Shaded' },
  { kind: 'option', value: 'wireframe', label: 'Wireframe' },
];

function PanelContent() {
  const [grid, setGrid] = useState(false);
  const [shading, setShading] = useState<Shading>('shaded');

  return (
    <>
      <Checkbox checked={grid} onCheckedChange={setGrid} label={GRID} />
      <Select
        aria-label={SHADING_LABEL}
        options={SHADING_OPTIONS}
        value={shading}
        onValueChange={setShading}
      />
      <Button>{APPLY}</Button>
    </>
  );
}

function Harness() {
  return (
    <>
      <Popover
        label={PANEL_LABEL}
        trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER}</Button>}
      >
        <PanelContent />
      </Popover>
      <Button>{OUTSIDE}</Button>
    </>
  );
}

function trigger(): HTMLElement {
  return screen.getByRole('button', { name: TRIGGER });
}

function panel(): HTMLElement | null {
  return screen.queryByRole('dialog', { name: PANEL_LABEL });
}

function focused(): Element | null {
  return document.activeElement;
}

async function openPanel() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(trigger());
  await waitFor(() => {
    expect(focused()).toBe(screen.getByRole('checkbox', { name: GRID }));
  });

  return user;
}

afterEach(() => {
  cleanup();
});

describe('Popover', () => {
  it('opens a labelled panel with the focus inside', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger());
    await waitFor(() => {
      expect(focused()).toBe(screen.getByRole('checkbox', { name: GRID }));
    });

    expect(panel()).not.toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('closes with Esc and returns the focus to the trigger', async () => {
    const user = await openPanel();

    await user.keyboard('{Escape}');

    expect(panel()).toBeNull();
    expect(focused()).toBe(trigger());
  });

  it('closes on a click outside', async () => {
    const user = await openPanel();

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(panel()).toBeNull();
  });

  it('closes when the focus leaves it', async () => {
    const user = await openPanel();

    await user.tab();
    await user.tab();
    await user.tab();

    await waitFor(() => {
      expect(panel()).toBeNull();
    });
  });

  it('stays open while working with its content', async () => {
    const user = await openPanel();

    await user.click(screen.getByRole('checkbox', { name: GRID }));

    expect(panel()).not.toBeNull();
    expect(screen.getByRole('checkbox', { name: GRID })).toHaveProperty('checked', true);
  });

  it('keeps itself open while a select inside it is used', async () => {
    const user = await openPanel();

    await user.click(screen.getByRole('combobox', { name: SHADING_LABEL }));
    await user.click(screen.getByRole('option', { name: 'Wireframe' }));

    expect(panel()).not.toBeNull();
    expect(screen.getByRole('combobox', { name: SHADING_LABEL }).textContent).toBe('Wireframe');
  });

  it('closes only the select inside it with Esc', async () => {
    const user = await openPanel();

    await user.click(screen.getByRole('combobox', { name: SHADING_LABEL }));
    await waitFor(() => {
      expect(focused()).toBe(screen.getByRole('option', { name: 'Shaded' }));
    });
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(panel()).not.toBeNull();
    expect(focused()).toBe(screen.getByRole('combobox', { name: SHADING_LABEL }));
  });
});

describe('Popover with a controlled state', () => {
  function ControlledHarness({ onOpenChange }: { readonly onOpenChange: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Popover
          label={PANEL_LABEL}
          open={open}
          onOpenChange={onOpenChange}
          trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER}</Button>}
        >
          <Button>{APPLY}</Button>
        </Popover>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          {OUTSIDE}
        </Button>
      </>
    );
  }

  it('follows the open prop and only reports requested changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ControlledHarness onOpenChange={onOpenChange} />);

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel()).not.toBeNull();
  });

  it('closes when the owner changes the open prop', async () => {
    const user = userEvent.setup();
    render(<ControlledHarness onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(panel()).toBeNull();
  });
});
