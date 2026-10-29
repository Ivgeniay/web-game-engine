import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { Dialog } from '@/ui/dialog/Dialog';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { MIXED_VALUE_PLACEHOLDER } from './fieldBox';
import { TextField } from './TextField';
import type { TextFieldUpdateMode } from './TextField';

const LABEL = 'Name';
const TOOLBAR_LABEL = 'Tools';
const INITIAL = 'Cube';
const EMPTY_MESSAGE = 'Name is required';
const DIALOG_TITLE = 'Rename';

interface HarnessProps {
  readonly onValueChange: ValueChangeHandler<string>;
  readonly updateMode?: TextFieldUpdateMode;
  readonly validate?: (text: string) => string | undefined;
  readonly mixed?: boolean;
}

function Harness({ onValueChange, updateMode, validate, mixed }: HarnessProps) {
  const [value, setValue] = useState(INITIAL);

  return (
    <TextField
      aria-label={LABEL}
      value={value}
      updateMode={updateMode}
      validate={validate}
      mixed={mixed}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange(next, phase);
      }}
    />
  );
}

function requireText(text: string): string | undefined {
  return text === '' ? EMPTY_MESSAGE : undefined;
}

function field(): HTMLInputElement {
  const element = screen.getByRole('textbox', { name: LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('TextField did not render an input element');
  }

  return element;
}

function description(): string {
  const ids = field().getAttribute('aria-describedby') ?? '';

  return ids
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ');
}

afterEach(() => {
  cleanup();
});

describe('TextField', () => {
  it('renders a native text input with the value', () => {
    render(<TextField aria-label={LABEL} value={INITIAL} />);

    expect(field().type).toBe('text');
    expect(field().value).toBe(INITIAL);
  });

  it('commits a delayed edit only on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), ' 2');

    expect(field().value).toBe('Cube 2');
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Cube 2', 'commit');
    expect(document.activeElement).toBe(field());
  });

  it('commits when focus leaves the field', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), 's');
    await user.tab();

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Cubes', 'commit');
  });

  it('does not commit when the text did not change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(field());
    await user.keyboard('{Enter}');
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('restores the value and leaves the field on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), 'xyz');
    await user.keyboard('{Escape}');

    expect(field().value).toBe(INITIAL);
    expect(document.activeElement).not.toBe(field());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('previews every input in live mode and commits once', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} updateMode="live" />);

    await user.type(field(), 'ab{Enter}');

    expect(onValueChange.mock.calls).toEqual([
      ['Cubea', 'preview'],
      ['Cubeab', 'preview'],
      ['Cubeab', 'commit'],
    ]);
  });

  it('cancels a live edit back to the value at its start', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} updateMode="live" />);

    await user.type(field(), 'a{Escape}');

    expect(onValueChange).toHaveBeenLastCalledWith(INITIAL, 'cancel');
    expect(field().value).toBe(INITIAL);
  });

  it('marks an invalid draft and describes it', async () => {
    const user = userEvent.setup();
    render(<Harness onValueChange={vi.fn()} validate={requireText} />);

    expect(field().getAttribute('aria-invalid')).toBeNull();

    await user.clear(field());

    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(description()).toBe(EMPTY_MESSAGE);
    expect(screen.getByRole('tooltip').textContent).toBe(EMPTY_MESSAGE);
  });

  it('does not commit an invalid draft and returns the last valid value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} validate={requireText} />);

    await user.clear(field());
    await user.keyboard('{Enter}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().value).toBe(INITIAL);
    expect(field().getAttribute('aria-invalid')).toBeNull();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('does not preview an invalid draft in live mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} updateMode="live" validate={requireText} />);

    await user.clear(field());

    expect(onValueChange).not.toHaveBeenCalledWith('', 'preview');
  });

  it('shows a mixed value as a dash and commits any edit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} mixed />);

    expect(field().value).toBe('');
    expect(field().placeholder).toBe(MIXED_VALUE_PLACEHOLDER);

    await user.type(field(), INITIAL);
    await user.tab();

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(INITIAL, 'commit');
  });

  it('hides the text of a password field', () => {
    render(<TextField aria-label={LABEL} value={INITIAL} type="password" />);

    expect(screen.getByLabelText(LABEL).getAttribute('type')).toBe('password');
  });

  it('ignores input when disabled and leaves the Tab order', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TextField aria-label={LABEL} value={INITIAL} onValueChange={onValueChange} disabled />);

    await user.type(field(), 'a');
    await user.tab();

    expect(field().disabled).toBe(true);
    expect(document.activeElement).not.toBe(field());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps a read-only value in the Tab order', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TextField aria-label={LABEL} value={INITIAL} onValueChange={onValueChange} readOnly />);

    await user.tab();
    await user.keyboard('a{Enter}');

    expect(document.activeElement).toBe(field());
    expect(field().value).toBe(INITIAL);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps the arrow keys and joins the toolbar order', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <TextField aria-label={LABEL} value={INITIAL} />
      </Toolbar>,
    );

    await user.tab();
    await user.keyboard('{ArrowLeft}');

    expect(document.activeElement).toBe(field());
    expect(field().getAttribute('tabindex')).toBe('0');
  });

  it('forwards ref and native attributes', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField aria-label={LABEL} value={INITIAL} ref={ref} name="object-name" />);

    expect(ref.current).toBe(field());
    expect(field().getAttribute('name')).toBe('object-name');
  });
});

function DialogWithField() {
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
      <Harness onValueChange={vi.fn()} />
    </Dialog>
  );
}

describe('TextField inside a popup', () => {
  it('cancels the edit on Esc without closing the dialog, and closes it on the next Esc', async () => {
    const user = userEvent.setup();
    render(<DialogWithField />);
    await waitFor(() => {
      expect(document.activeElement).toBe(field());
    });

    await user.keyboard('xyz{Escape}');

    expect(field().value).toBe(INITIAL);
    expect(screen.getByRole('dialog')).toBeDefined();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('TextField edit state', () => {
  it('marks typing that differs from the committed value', async () => {
    const user = userEvent.setup();
    render(<Harness onValueChange={vi.fn()} />);

    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('committed');

    await user.type(field(), 'x');

    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('uncommitted');

    await user.keyboard('{Backspace}');

    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('committed');

    await user.keyboard('y{Enter}');

    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('committed');
  });
});
