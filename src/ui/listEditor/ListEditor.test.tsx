import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { DragAndDropLayer } from '@/ui/dragAndDrop/DragAndDropLayer';
import { NumberField } from '@/ui/numberField/NumberField';
import { ListEditor } from './ListEditor';
import type { ListEditorLabels } from './ListEditor';

const LABEL = 'Waypoints';
const ROW_HEIGHT = 20;
const POINTER_X = 10;
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const LABELS: ListEditorLabels = {
  size: 'Size',
  add: 'Add element',
  empty: 'List is empty',
  itemLabel: (index) => `Element ${String(index)}`,
  moveItem: (index) => `Move element ${String(index)}`,
  removeItem: (index) => `Remove element ${String(index)}`,
  sizeMessages: MESSAGES,
};

interface HarnessProps {
  readonly initial?: readonly number[];
  readonly mixed?: boolean;
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<readonly number[]>;
}

function Harness({ initial = [10, 20, 30], mixed, disabled, onValueChange }: HarnessProps) {
  const [items, setItems] = useState(initial);
  const [expanded, setExpanded] = useState(true);

  return (
    <DragAndDropLayer>
      <ListEditor
        label={LABEL}
        value={items}
        mixed={mixed}
        disabled={disabled}
        expanded={expanded}
        onExpandedChange={setExpanded}
        labels={LABELS}
        createItem={() => 0}
        renderItem={({ item, label, disabled: itemDisabled, onItemChange }) => (
          <NumberField
            aria-label={label}
            value={item}
            disabled={itemDisabled}
            invalidMessages={MESSAGES}
            onValueChange={onItemChange}
          />
        )}
        onValueChange={(next, phase) => {
          setItems(next);
          onValueChange?.(next, phase);
        }}
      />
    </DragAndDropLayer>
  );
}

function values(): readonly string[] {
  return screen
    .queryAllByRole('spinbutton', { name: /^Element/ })
    .map((element) => (element instanceof HTMLInputElement ? element.value : ''));
}

function sizeField(): HTMLElement {
  return screen.getByRole('spinbutton', { name: LABELS.size });
}

function handle(index: number): HTMLElement {
  return screen.getByRole('button', { name: LABELS.moveItem(index) });
}

function rowIndexOf(element: Element): number {
  const row = element.closest('[data-list-editor-row]');

  return row?.parentElement === null || row === null
    ? 0
    : Array.from(row.parentElement.children).indexOf(row);
}

beforeEach(() => {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: () => screen.getByRole('list', { name: LABEL }),
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    return DOMRect.fromRect({
      x: 0,
      y: rowIndexOf(this) * ROW_HEIGHT,
      width: ROW_HEIGHT,
      height: ROW_HEIGHT,
    });
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, 'elementFromPoint');
});

describe('ListEditor', () => {
  it('shows the elements with their size and collapses', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: LABEL });

    expect(values()).toEqual(['10', '20', '30']);
    expect(sizeField().getAttribute('aria-valuenow')).toBe('3');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    await user.click(toggle);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('list', { hidden: true }).closest('[hidden]')).not.toBeNull();
  });

  it('passes an element edit through with its phase', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const second = screen.getByRole('spinbutton', { name: 'Element 1' });

    await user.clear(second);
    await user.type(second, '25{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([10, 25, 30], 'commit');
  });

  it('adds an element at the end with one commit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: LABELS.add }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([10, 20, 30, 0], 'commit');
  });

  it('removes an element and moves the focus to the next remove button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: LABELS.removeItem(2) }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([10, 20], 'commit');
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole('button', { name: LABELS.removeItem(1) }),
      );
    });
  });

  it('shows an empty list and focuses the add button after the last removal', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[5]} />);

    await user.click(screen.getByRole('button', { name: LABELS.removeItem(0) }));

    expect(screen.getByText(LABELS.empty)).toBeDefined();
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: LABELS.add }));
    });
  });

  it('resizes from the size field with copies of the last element', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(sizeField());
    await user.type(sizeField(), '5{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith([10, 20, 30, 30, 30], 'commit');

    await user.clear(sizeField());
    await user.type(sizeField(), '1{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith([10], 'commit');
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('moves an element with Alt+arrows on its handle and keeps the focus on it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    handle(0).focus();
    await user.keyboard('{ArrowDown}');

    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([20, 10, 30], 'commit');
    await waitFor(() => {
      expect(document.activeElement).toBe(handle(1));
    });

    await user.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}');

    expect(values()).toEqual(['20', '30', '10']);
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('reorders by dragging a handle with one commit', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    fireEvent.pointerDown(handle(0), { button: 0, clientX: POINTER_X, clientY: 5 });
    fireEvent.pointerMove(window, { clientX: POINTER_X + ROW_HEIGHT, clientY: 5 });
    fireEvent.pointerMove(window, { clientX: POINTER_X, clientY: 55 });

    expect(screen.getAllByRole('listitem')[2]?.hasAttribute('data-drop-after')).toBe(true);

    fireEvent.pointerUp(window, { clientX: POINTER_X, clientY: 55 });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([20, 30, 10], 'commit');
  });

  it('shows a dash and turns editing off for different arrays', () => {
    render(<Harness mixed />);

    expect(sizeField().getAttribute('placeholder')).toBe('—');
    expect(sizeField().hasAttribute('disabled')).toBe(true);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByRole('button', { name: LABELS.add }).hasAttribute('disabled')).toBe(true);
  });

  it('turns every control off when disabled', () => {
    render(<Harness disabled />);

    expect(handle(0).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('spinbutton', { name: 'Element 0' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(
      screen.getByRole('button', { name: LABELS.removeItem(0) }).hasAttribute('disabled'),
    ).toBe(true);
  });
});
