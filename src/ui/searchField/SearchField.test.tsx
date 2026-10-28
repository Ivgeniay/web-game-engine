import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '@/ui/dialog/Dialog';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { SearchField } from './SearchField';

const LABEL = 'Search objects';
const CLEAR_LABEL = 'Clear search';
const TOOLBAR_LABEL = 'Tools';
const DIALOG_TITLE = 'Find object';
const NEXT_LABEL = 'Next';
const PLACEHOLDER = 'Search';

interface HarnessProps {
  readonly initial?: string;
  readonly onValueChange?: (value: string) => void;
}

function Harness({ initial = '', onValueChange }: HarnessProps) {
  const [value, setValue] = useState(initial);

  return (
    <SearchField
      label={LABEL}
      clearLabel={CLEAR_LABEL}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

function field(): HTMLInputElement {
  const element = screen.getByRole('searchbox', { name: LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('SearchField did not render an input element');
  }

  return element;
}

function clearButton(): HTMLElement | null {
  return screen.queryByRole('button', { name: CLEAR_LABEL });
}

afterEach(() => {
  cleanup();
});

describe('SearchField', () => {
  it('renders a labelled search input', () => {
    render(<Harness />);

    expect(field().type).toBe('search');
    expect(field().value).toBe('');
  });

  it('gives the value on every input', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), 'cam');

    expect(onValueChange.mock.calls).toEqual([['c'], ['ca'], ['cam']]);
  });

  it('shows the clear button only when the field is not empty', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(clearButton()).toBeNull();

    await user.type(field(), 'a');

    expect(clearButton()).not.toBeNull();
  });

  it('clears the query and keeps focus in the field', async () => {
    const user = userEvent.setup();
    render(<Harness initial="cam" />);

    await user.click(field());

    const button = clearButton();

    if (button === null) {
      throw new Error('Clear button is missing');
    }

    await user.click(button);

    expect(field().value).toBe('');
    expect(document.activeElement).toBe(field());
    expect(clearButton()).toBeNull();
  });

  it('keeps the clear button out of the Tab order', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Harness initial="cam" />
        <button type="button">{NEXT_LABEL}</button>
      </>,
    );

    await user.tab();
    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: NEXT_LABEL }));
  });

  it('clears on the first Esc and leaves the field on the second', async () => {
    const user = userEvent.setup();
    render(<Harness initial="cam" />);

    await user.click(field());
    await user.keyboard('{Escape}');

    expect(field().value).toBe('');
    expect(document.activeElement).toBe(field());

    await user.keyboard('{Escape}');

    expect(document.activeElement).not.toBe(field());
  });

  it('ignores input when disabled and hides the clear button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SearchField
        label={LABEL}
        clearLabel={CLEAR_LABEL}
        value="cam"
        onValueChange={onValueChange}
        disabled
      />,
    );

    await user.type(field(), 'a');

    expect(field().disabled).toBe(true);
    expect(clearButton()).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('joins the toolbar order as a single stop', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <SearchField label={LABEL} clearLabel={CLEAR_LABEL} value="cam" onValueChange={vi.fn()} />
      </Toolbar>,
    );

    await user.tab();

    expect(document.activeElement).toBe(field());
    expect(field().getAttribute('tabindex')).toBe('0');
    expect(clearButton()?.getAttribute('tabindex')).toBe('-1');
  });

  it('forwards ref and native attributes', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <SearchField
        label={LABEL}
        clearLabel={CLEAR_LABEL}
        value=""
        onValueChange={vi.fn()}
        ref={ref}
        placeholder={PLACEHOLDER}
      />,
    );

    expect(ref.current).toBe(field());
    expect(field().placeholder).toBe(PLACEHOLDER);
  });
});

function DialogWithSearch() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      title={DIALOG_TITLE}
      actions={null}
    >
      <Harness initial="cam" />
    </Dialog>
  );
}

describe('SearchField inside a popup', () => {
  it('clears on Esc without closing the dialog, and closes it on the next Esc', async () => {
    const user = userEvent.setup();
    render(<DialogWithSearch />);
    await waitFor(() => {
      expect(document.activeElement).toBe(field());
    });

    await user.keyboard('{Escape}');

    expect(field().value).toBe('');
    expect(screen.getByRole('dialog')).toBeDefined();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
