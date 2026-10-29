import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { FlagsField } from './FlagsField';
import type { FlagOption, FlagsChange } from './flagsValue';

type Layer = 'default' | 'water' | 'ui';

const LABEL = 'Culling mask';
const TOOLBAR_LABEL = 'Tools';
const NONE = 'Nothing';
const ALL = 'Everything';
const MIXED = 'Mixed';
const OPTIONS: readonly FlagOption<Layer>[] = [
  { value: 'default', label: 'Default' },
  { value: 'water', label: 'Water' },
  { value: 'ui', label: 'UI', disabled: true },
];

interface HarnessProps {
  readonly initial?: readonly Layer[];
  readonly mixedFlags?: readonly Layer[];
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<FlagsChange<Layer>>;
}

function Harness({
  initial = ['default'],
  mixedFlags = [],
  disabled,
  onValueChange,
}: HarnessProps) {
  const [value, setValue] = useState<FlagsChange<Layer>>({ on: initial, mixed: mixedFlags });

  return (
    <FlagsField
      aria-label={LABEL}
      options={OPTIONS}
      value={value.on}
      mixedFlags={value.mixed}
      noneLabel={NONE}
      allLabel={ALL}
      mixedLabel={MIXED}
      disabled={disabled}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function field(): HTMLElement {
  return screen.getByRole('button', { name: LABEL });
}

function flag(name: string): HTMLElement {
  return screen.getByRole('menuitemcheckbox', { name });
}

afterEach(() => {
  cleanup();
});

describe('FlagsField', () => {
  it('summarizes the chosen flags on the field', () => {
    render(<Harness />);

    expect(field().textContent).toBe('Default');
    expect(field().getAttribute('aria-haspopup')).toBe('menu');
  });

  it('summarizes nothing, several flags and a mixed selection', () => {
    const { unmount } = render(<Harness initial={[]} />);

    expect(field().textContent).toBe(NONE);
    unmount();

    render(<Harness initial={['default', 'water']} mixedFlags={['ui']} />);

    expect(field().textContent).toBe(MIXED);
  });

  it('toggles a flag with a commit and keeps the list open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(field());
    await user.click(flag('Water'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(
      { on: ['default', 'water'], mixed: [] },
      'commit',
    );
    expect(screen.getByRole('menu')).toBeDefined();
    expect(flag('Water').getAttribute('aria-checked')).toBe('true');
    expect(field().textContent).toBe('Default, Water');
  });

  it('opens from the keyboard and toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    field().focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await waitFor(() => {
      expect(document.activeElement).toBe(flag(NONE));
    });
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith({ on: [], mixed: [] }, 'commit');

    await user.keyboard(' ');

    expect(onValueChange).toHaveBeenLastCalledWith({ on: ['default'], mixed: [] }, 'commit');
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('closes on Esc without a change and returns the focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(field());
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(document.activeElement).toBe(field());
    });
  });

  it('sets nothing and everything without touching disabled flags', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness initial={['ui']} onValueChange={onValueChange} />);

    await user.click(field());

    expect(flag(NONE).getAttribute('aria-checked')).toBe('false');

    await user.click(flag(ALL));

    expect(onValueChange).toHaveBeenLastCalledWith(
      { on: ['default', 'water', 'ui'], mixed: [] },
      'commit',
    );
    expect(flag(ALL).getAttribute('aria-checked')).toBe('true');
    expect(field().textContent).toBe(ALL);

    await user.click(flag(NONE));

    expect(onValueChange).toHaveBeenLastCalledWith({ on: ['ui'], mixed: [] }, 'commit');
    expect(flag('UI').hasAttribute('disabled')).toBe(true);
  });

  it('shows a mixed flag and resolves it on toggle', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness mixedFlags={['water']} onValueChange={onValueChange} />);

    await user.click(field());

    expect(flag('Water').getAttribute('aria-checked')).toBe('mixed');

    await user.click(flag('Water'));

    expect(onValueChange).toHaveBeenLastCalledWith(
      { on: ['default', 'water'], mixed: [] },
      'commit',
    );
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);

    await user.click(field());

    expect(screen.queryByRole('menu')).toBeNull();
    expect(field().hasAttribute('disabled')).toBe(true);
  });

  it('joins the roving focus of a toolbar', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <Harness />
      </Toolbar>,
    );

    await user.tab();

    expect(document.activeElement).toBe(field());
  });
});
