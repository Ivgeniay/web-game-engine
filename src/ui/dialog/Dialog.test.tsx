import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Popover } from '@/ui/popover/Popover';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { Dialog } from './Dialog';

type Shader = 'lit' | 'unlit';

const OPEN = 'New material';
const OUTSIDE = 'Outside';
const TITLE = 'Create material';
const DESCRIPTION = 'The material is added to the current folder.';
const NAME_LABEL = 'Name';
const NOTES_LABEL = 'Notes';
const SHADER_LABEL = 'Shader';
const HELP_LABEL = 'Help';
const CANCEL = 'Cancel';
const CREATE = 'Create';
const SEARCH_LABEL = 'Search';
const PANEL_LABEL = 'Filters';
const PANEL_TRIGGER = 'Filters';
const PANEL_FIELD_LABEL = 'Filter text';

const SHADER_OPTIONS: readonly SelectEntry<Shader>[] = [
  { kind: 'option', value: 'lit', label: 'Lit' },
  { kind: 'option', value: 'unlit', label: 'Unlit' },
];

interface HarnessProps {
  readonly onSubmit?: () => void;
  readonly onClose?: () => void;
  readonly focusCreate?: boolean;
  readonly withFields?: boolean;
  readonly onSearchEnter?: () => void;
}

function Harness({
  onSubmit,
  onClose,
  focusCreate = false,
  withFields = true,
  onSearchEnter,
}: HarnessProps) {
  const [open, setOpen] = useState(false);
  const [shader, setShader] = useState<Shader>('lit');
  const createRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    onClose?.();
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {OPEN}
      </Button>
      <Button>{OUTSIDE}</Button>
      <Dialog
        open={open}
        onClose={close}
        title={TITLE}
        description={DESCRIPTION}
        onSubmit={onSubmit}
        initialFocus={focusCreate ? createRef : undefined}
        actions={
          <>
            <Button onClick={close}>{CANCEL}</Button>
            <Button ref={createRef} type="submit" variant="accent">
              {CREATE}
            </Button>
          </>
        }
      >
        {withFields && (
          <>
            <input aria-label={NAME_LABEL} />
            <textarea aria-label={NOTES_LABEL} />
            <Select
              aria-label={SHADER_LABEL}
              options={SHADER_OPTIONS}
              value={shader}
              onValueChange={setShader}
            />
            <IconButton label={HELP_LABEL} icon={frameworkIcons.help} />
            <input
              aria-label={SEARCH_LABEL}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onSearchEnter?.();
                }
              }}
            />
            <Popover
              label={PANEL_LABEL}
              trigger={(triggerProps) => <Button {...triggerProps}>{PANEL_TRIGGER}</Button>}
            >
              <input aria-label={PANEL_FIELD_LABEL} />
            </Popover>
          </>
        )}
      </Dialog>
    </>
  );
}

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

async function openDialog(props: HarnessProps = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(button(OPEN));

  return user;
}

async function expectFocusOn(element: () => HTMLElement): Promise<void> {
  await waitFor(() => {
    expect(focused()).toBe(element());
  });
}

function nameField(): HTMLElement {
  return screen.getByRole('textbox', { name: NAME_LABEL });
}

afterEach(() => {
  cleanup();
});

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is a modal dialog named by its title and described by its description', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog', { name: TITLE });

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText(DESCRIPTION).id);
  });

  it('puts the focus on the first field', async () => {
    await openDialog();

    await expectFocusOn(nameField);
  });

  it('puts the focus on the element the owner points to', async () => {
    await openDialog({ focusCreate: true });

    await expectFocusOn(() => button(CREATE));
  });

  it('keeps the focus inside', async () => {
    const user = await openDialog();
    await expectFocusOn(nameField);

    button(CREATE).focus();
    await user.tab();

    await expectFocusOn(nameField);
    await user.tab({ shift: true });
    await expectFocusOn(() => button(CREATE));
  });

  it('asks to close with Esc and returns the focus to the opener', async () => {
    const onClose = vi.fn();
    const user = await openDialog({ onClose });
    await expectFocusOn(nameField);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
    await expectFocusOn(() => button(OPEN));
  });

  it('does not close on a click on the backdrop', async () => {
    const onClose = vi.fn();
    const user = await openDialog({ onClose });
    await expectFocusOn(nameField);
    const backdrop = screen.getByRole('dialog').parentElement;

    if (backdrop === null) {
      throw new Error('Dialog has no backdrop');
    }
    await user.click(backdrop);

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('submits with the submit button', async () => {
    const onSubmit = vi.fn();
    const user = await openDialog({ onSubmit });

    await user.click(button(CREATE));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('submits once with Enter in a single-line field', async () => {
    const onSubmit = vi.fn();
    const user = await openDialog({ onSubmit });
    await expectFocusOn(nameField);

    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('submits with Enter when nothing else in the dialog takes the focus', async () => {
    const onSubmit = vi.fn();
    const user = await openDialog({ onSubmit, withFields: false });
    await expectFocusOn(() => button(CANCEL));
    act(() => {
      screen.getByRole('dialog').focus();
    });

    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('leaves Enter to multi-line fields and buttons', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const user = await openDialog({ onSubmit, onClose });
    await expectFocusOn(nameField);

    await user.click(screen.getByRole('textbox', { name: NOTES_LABEL }));
    await user.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();

    button(CANCEL).focus();
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('leaves Enter to a field that handles it itself', async () => {
    const onSubmit = vi.fn();
    const onSearchEnter = vi.fn();
    const user = await openDialog({ onSubmit, onSearchEnter });
    await expectFocusOn(nameField);

    await user.click(screen.getByRole('textbox', { name: SEARCH_LABEL }));
    await user.keyboard('{Enter}');

    expect(onSearchEnter).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does nothing on Enter without a submit handler', async () => {
    const onClose = vi.fn();
    const user = await openDialog({ onClose });
    await expectFocusOn(nameField);

    await user.keyboard('{Enter}');

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeDefined();
  });
});

describe('Dialog with popups inside', () => {
  it('chooses in a select with Enter without submitting and closes only the list with Esc', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    const user = await openDialog({ onSubmit, onClose });
    await expectFocusOn(nameField);

    await user.click(screen.getByRole('combobox', { name: SHADER_LABEL }));
    await expectFocusOn(() => screen.getByRole('option', { name: 'Lit' }));
    await user.keyboard('{ArrowDown}{Enter}');

    expect(screen.getByRole('combobox', { name: SHADER_LABEL }).textContent).toBe('Unlit');
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('combobox', { name: SHADER_LABEL }));
    await expectFocusOn(() => screen.getByRole('option', { name: 'Unlit' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('does not submit on Enter in a field of a popover opened inside', async () => {
    const onSubmit = vi.fn();
    const user = await openDialog({ onSubmit });
    await expectFocusOn(nameField);

    await user.click(button(PANEL_TRIGGER));
    await expectFocusOn(() => screen.getByRole('textbox', { name: PANEL_FIELD_LABEL }));
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: TITLE })).toBeDefined();
  });

  it('shows tooltips of buttons inside', async () => {
    await openDialog();
    await expectFocusOn(nameField);

    act(() => {
      button(HELP_LABEL).focus();
    });

    expect(screen.getByRole('tooltip').textContent).toBe(HELP_LABEL);
  });
});
