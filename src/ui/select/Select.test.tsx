import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE } from '@/ui/popup/popupLayerAttributes';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { Select } from './Select';
import type { SelectAction, SelectEntry } from './selectOptions';

type Layer = 'default' | 'water' | 'ui' | 'hidden';

const FIELD_LABEL = 'Layer';
const PLACEHOLDER = 'Choose a layer';
const OUTSIDE = 'Outside';
const TOOLBAR_LABEL = 'Scene';

const OPTIONS: readonly SelectEntry<Layer>[] = [
  { kind: 'option', value: 'default', label: 'Default', icon: frameworkIcons.layout },
  { kind: 'option', value: 'water', label: 'Water' },
  { kind: 'separator', id: 'separator' },
  { kind: 'option', value: 'hidden', label: 'Hidden', disabled: true },
  { kind: 'option', value: 'ui', label: 'UI' },
];

interface HarnessProps {
  readonly initial: Layer | null;
  readonly onValueChange?: (value: Layer) => void;
  readonly action?: SelectAction;
  readonly disabled?: boolean;
}

function Harness({ initial, onValueChange, action, disabled }: HarnessProps) {
  const [value, setValue] = useState<Layer | null>(initial);

  return (
    <>
      <Select
        aria-label={FIELD_LABEL}
        options={OPTIONS}
        value={value}
        placeholder={PLACEHOLDER}
        action={action}
        disabled={disabled}
        onValueChange={(next) => {
          setValue(next);
          onValueChange?.(next);
        }}
      />
      <Button>{OUTSIDE}</Button>
    </>
  );
}

function field(): HTMLElement {
  return screen.getByRole('combobox', { name: FIELD_LABEL });
}

function option(name: string): HTMLElement {
  return screen.getByRole('option', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

async function expectFocusOn(name: string): Promise<void> {
  await waitFor(() => {
    expect(focused()).toBe(option(name));
  });
}

async function openWithClick(props: Partial<HarnessProps> = {}) {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(<Harness initial="water" onValueChange={onValueChange} {...props} />);
  await user.click(field());
  await expectFocusOn('Water');

  return { user, onValueChange };
}

afterEach(() => {
  cleanup();
});

describe('Select field', () => {
  it('is a combobox showing the chosen option', () => {
    render(<Harness initial="water" />);

    expect(field().textContent).toBe('Water');
    expect(field().getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the placeholder when nothing is chosen', () => {
    render(<Harness initial={null} />);

    expect(field().textContent).toBe(PLACEHOLDER);
  });

  it.each(['{Enter}', ' ', '{Alt>}{ArrowDown}{/Alt}'])(
    'opens from the keyboard with %s',
    async (key) => {
      const user = userEvent.setup();
      render(<Harness initial="water" />);

      await user.tab();
      await user.keyboard(key);

      expect(screen.getByRole('listbox')).toBeDefined();
      await expectFocusOn('Water');
    },
  );

  it('does not open or change the value with arrows or letters while closed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness initial="water" onValueChange={onValueChange} />);

    await user.tab();
    await user.keyboard('{ArrowDown}{ArrowUp}u');

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().textContent).toBe('Water');
  });

  it('cannot be opened when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness initial="water" disabled />);

    await user.click(field());

    expect(field()).toHaveProperty('disabled', true);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select list', () => {
  it('marks the chosen option and blocks tooltips', async () => {
    await openWithClick();
    const list = screen.getByRole('listbox');

    expect(option('Water').getAttribute('aria-selected')).toBe('true');
    expect(option('Default').getAttribute('aria-selected')).toBe('false');
    expect(list.hasAttribute(POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE)).toBe(true);
    expect(within(list).getAllByRole('option')).toHaveLength(4);
  });

  it('moves with arrows around the ends and skips disabled options', async () => {
    const { user } = await openWithClick();

    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(option('UI'));
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(option('Default'));
    await user.keyboard('{ArrowUp}');
    expect(focused()).toBe(option('UI'));
  });

  it('finds an option by its first letters', async () => {
    const { user } = await openWithClick();

    await user.keyboard('d');

    expect(focused()).toBe(option('Default'));
  });

  it('treats Space as part of the search while typing', async () => {
    const { user, onValueChange } = await openWithClick();

    await user.keyboard('d ');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeDefined();
  });

  it.each(['{Enter}', ' '])('chooses with %s, closes and returns the focus', async (key) => {
    const { user, onValueChange } = await openWithClick();

    await user.keyboard('{ArrowUp}');
    await user.keyboard(key);

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('default');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(focused()).toBe(field());
    expect(field().textContent).toBe('Default');
  });

  it('chooses on click', async () => {
    const { user, onValueChange } = await openWithClick();

    await user.click(option('UI'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('ui');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('ignores disabled options', async () => {
    const { user, onValueChange } = await openWithClick();

    await user.click(option('Hidden'));

    expect(option('Hidden').getAttribute('aria-disabled')).toBe('true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('closes with Esc without changing the value and returns the focus', async () => {
    const { user, onValueChange } = await openWithClick();

    await user.keyboard('{ArrowDown}{Escape}');

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(focused()).toBe(field());
  });

  it('closes on a click outside', async () => {
    const { user } = await openWithClick();

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('runs the action at the end of the list', async () => {
    const onSelect = vi.fn();
    const { user, onValueChange } = await openWithClick({
      action: { label: 'Add layer…', icon: frameworkIcons.plus, onSelect },
    });

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select in a toolbar', () => {
  it('joins the roving focus of the toolbar', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <Button>{OUTSIDE}</Button>
        <Select
          aria-label={FIELD_LABEL}
          options={OPTIONS}
          value="water"
          onValueChange={vi.fn()}
          variant="flat"
          size="sm"
        />
      </Toolbar>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(field());

    await user.tab({ shift: true });
    expect(focused()).toBe(document.body);
  });
});
