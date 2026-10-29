import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { Dialog } from '@/ui/dialog/Dialog';
import { MacPlatformContext } from '@/ui/platform/macPlatformContext';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import { TextArea } from './TextArea';

const LABEL = 'Note';
const INITIAL = 'First line';
const EMPTY_MESSAGE = 'Note is required';
const DIALOG_TITLE = 'Edit note';
const MIN_ROWS = 3;

interface HarnessProps {
  readonly onValueChange: ValueChangeHandler<string>;
  readonly updateMode?: TextFieldUpdateMode;
  readonly validate?: (text: string) => string | undefined;
  readonly mixed?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
}

function Harness({ onValueChange, ...props }: HarnessProps) {
  const [value, setValue] = useState(INITIAL);

  return (
    <TextArea
      {...props}
      aria-label={LABEL}
      value={value}
      minRows={MIN_ROWS}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange(next, phase);
      }}
    />
  );
}

class FakeResizeObserver {
  observe(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

function field(): HTMLTextAreaElement {
  const element = screen.getByRole('textbox', { name: LABEL });

  if (!(element instanceof HTMLTextAreaElement)) {
    throw new Error('TextArea did not render a textarea element');
  }

  return element;
}

function requireText(text: string): string | undefined {
  return text === '' ? EMPTY_MESSAGE : undefined;
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('TextArea', () => {
  it('renders a textarea with the value and the minimum rows', () => {
    render(<Harness onValueChange={vi.fn()} />);

    expect(field().value).toBe(INITIAL);
    expect(field().rows).toBe(MIN_ROWS);
    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('committed');
  });

  it('inserts a line break on Enter without committing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), '{Enter}Second');

    expect(field().value).toBe(`${INITIAL}\nSecond`);
    expect(field().getAttribute(VALUE_EDIT_ATTRIBUTE)).toBe('uncommitted');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('commits on Ctrl+Enter and keeps the focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), '!{Control>}{Enter}{/Control}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(`${INITIAL}!`, 'commit');
    expect(field().value).toBe(`${INITIAL}!`);
    expect(document.activeElement).toBe(field());
  });

  it('commits on Cmd+Enter on macOS and not on Ctrl+Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MacPlatformContext value>
        <Harness onValueChange={onValueChange} />
      </MacPlatformContext>,
    );

    await user.type(field(), '!{Control>}{Enter}{/Control}');

    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Meta>}{Enter}{/Meta}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(`${INITIAL}!`, 'commit');
  });

  it('commits when focus leaves the field', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), '!');
    await user.tab();

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(`${INITIAL}!`, 'commit');
  });

  it('restores the value and leaves the field on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.type(field(), '{Enter}more{Escape}');

    expect(field().value).toBe(INITIAL);
    expect(document.activeElement).not.toBe(field());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps a dialog open on the Esc that cancels an edit', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title={DIALOG_TITLE} actions={null}>
        <Harness onValueChange={vi.fn()} updateMode="live" />
      </Dialog>,
    );

    await user.type(field(), 'x{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('previews every input in live mode and cancels to the start', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} updateMode="live" />);

    await user.type(field(), 'ab{Escape}');

    expect(onValueChange.mock.calls).toEqual([
      [`${INITIAL}a`, 'preview'],
      [`${INITIAL}ab`, 'preview'],
      [INITIAL, 'cancel'],
    ]);
  });

  it('marks an invalid draft and does not commit it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} validate={requireText} />);

    await user.clear(field());

    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('tooltip').textContent).toBe(EMPTY_MESSAGE);

    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().value).toBe(INITIAL);
  });

  it('shows a mixed value as a dash and commits any edit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} mixed />);

    expect(field().value).toBe('');
    expect(field().placeholder).toBe(MIXED_VALUE_PLACEHOLDER);

    await user.type(field(), 'Shared');
    await user.tab();

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Shared', 'commit');
  });

  it('ignores typing when read-only', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} readOnly />);

    await user.type(field(), 'x');
    await user.tab();

    expect(field().value).toBe(INITIAL);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('leaves the Tab order when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness onValueChange={vi.fn()} disabled />);

    await user.tab();

    expect(field().disabled).toBe(true);
    expect(document.activeElement).not.toBe(field());
  });
});
