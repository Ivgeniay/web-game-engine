import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import type { MenuItem } from '@/ui/menu/menuItems';
import { NumberField } from '@/ui/numberField/NumberField';
import type { NumberKind } from '@/ui/numberField/numberText';
import { TextField } from '@/ui/textField/TextField';
import { VALUE_DRAG_THRESHOLD } from '@/ui/valueDrag/valueDragSession';
import { PropertyRow } from './PropertyRow';

const LABEL = 'Mass';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const RESET_LABEL = 'Reset';
const START_X = 100;
const POINTER_ID = 1;

interface HarnessProps {
  readonly initial?: number;
  readonly kind?: NumberKind;
  readonly max?: number;
  readonly infinite?: boolean;
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<number>;
  readonly menuItems?: readonly MenuItem[];
}

function Harness({
  initial = 1,
  kind,
  max,
  infinite,
  disabled,
  onValueChange,
  menuItems,
}: HarnessProps) {
  const [value, setValue] = useState(initial);

  function handleValueChange(next: number, phase: 'preview' | 'commit' | 'cancel') {
    setValue(next);
    onValueChange?.(next, phase);
  }

  return (
    <PropertyRow
      label={LABEL}
      disabled={disabled}
      menuItems={menuItems}
      drag={{ value, onValueChange: handleValueChange, kind, max, step: 1, infinite }}
    >
      {({ id }) => (
        <NumberField
          id={id}
          kind={kind ?? 'float'}
          max={max}
          value={value}
          disabled={disabled}
          invalidMessages={MESSAGES}
          onValueChange={handleValueChange}
        />
      )}
    </PropertyRow>
  );
}

function field(): HTMLInputElement {
  const element = screen.getByLabelText(LABEL);

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('PropertyRow did not label the input');
  }

  return element;
}

function dragZone(): HTMLElement {
  const zone = screen.getByText(LABEL).parentElement;

  if (zone === null) {
    throw new Error('Label has no drag zone');
  }

  return zone;
}

function pointerDown(): void {
  fireEvent.pointerDown(dragZone(), { button: 0, pointerId: POINTER_ID, clientX: START_X });
}

function pointerMove(offset: number, modifiers: { shiftKey?: boolean } = {}): void {
  fireEvent.pointerMove(dragZone(), {
    pointerId: POINTER_ID,
    clientX: START_X + offset,
    ...modifiers,
  });
}

function pointerUp(): void {
  fireEvent.pointerUp(dragZone(), { pointerId: POINTER_ID });
}

class FakeResizeObserver {
  observe(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

let lockedElement: Element | null = null;

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  lockedElement = null;
  Object.defineProperty(document, 'pointerLockElement', {
    configurable: true,
    get: () => lockedElement,
  });
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
    requestPointerLock: vi.fn(() => {
      lockedElement = dragZone();
      document.dispatchEvent(new Event('pointerlockchange'));

      return Promise.resolve();
    }),
  });
  Object.assign(document, {
    exitPointerLock: vi.fn(() => {
      lockedElement = null;
      document.dispatchEvent(new Event('pointerlockchange'));
    }),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute('data-value-dragging');
});

describe('PropertyRow', () => {
  it('names the field with its label and focuses it on a click', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByText(LABEL));

    expect(document.activeElement).toBe(field());
  });

  it('changes the value by dragging the label and commits once', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerMove(VALUE_DRAG_THRESHOLD + 4);

    expect(field().value).toBe('5');
    expect(document.documentElement.hasAttribute('data-value-dragging')).toBe(true);

    pointerUp();

    expect(onValueChange.mock.calls).toEqual([
      [1, 'preview'],
      [5, 'preview'],
      [5, 'commit'],
    ]);
    expect(document.documentElement.hasAttribute('data-value-dragging')).toBe(false);
  });

  it('treats a move under the threshold as a click', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD - 1);
    pointerUp();

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('swallows the click that ends a drag, so the field does not get focus', () => {
    render(<Harness />);

    pointerDown();
    pointerUp();

    expect(fireEvent.click(screen.getByText(LABEL))).toBe(true);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD + 2);
    pointerUp();

    expect(fireEvent.click(screen.getByText(LABEL))).toBe(false);
    expect(fireEvent.click(screen.getByText(LABEL))).toBe(true);
  });

  it('takes a finer step with Shift', () => {
    render(<Harness />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerMove(VALUE_DRAG_THRESHOLD + 10, { shiftKey: true });
    pointerUp();

    expect(field().value).toBe('2');
  });

  it('stops at the limit', () => {
    render(<Harness kind="integer" max={3} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerMove(VALUE_DRAG_THRESHOLD + 50);
    pointerUp();

    expect(field().value).toBe('3');
  });

  it('cancels the drag on Esc', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerMove(VALUE_DRAG_THRESHOLD + 4);
    fireEvent.keyDown(window, { key: 'Escape' });
    pointerUp();

    expect(onValueChange).toHaveBeenLastCalledWith(1, 'cancel');
    expect(onValueChange).not.toHaveBeenCalledWith(expect.anything(), 'commit');
    expect(field().value).toBe('1');
  });

  it('commits the typed text before a drag starts from it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(field());
    await user.type(field(), '7');
    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerMove(VALUE_DRAG_THRESHOLD + 1);
    pointerUp();

    expect(onValueChange.mock.calls).toEqual([
      [7, 'commit'],
      [7, 'preview'],
      [8, 'preview'],
      [8, 'commit'],
    ]);
  });

  it('locks the pointer for an infinite drag and cancels when the lock ends', () => {
    const onValueChange = vi.fn();
    render(<Harness infinite onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);

    expect(lockedElement).toBe(dragZone());

    fireEvent.pointerMove(dragZone(), { pointerId: POINTER_ID, movementX: 3 });

    expect(field().value).toBe('4');

    act(() => {
      lockedElement = null;
      document.dispatchEvent(new Event('pointerlockchange'));
    });

    expect(onValueChange).toHaveBeenLastCalledWith(1, 'cancel');
    expect(field().value).toBe('1');
  });

  it('leaves the pointer lock after an infinite drag ends', () => {
    const onValueChange = vi.fn();
    render(<Harness infinite onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD);
    pointerUp();

    expect(lockedElement).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith(1, 'commit');
  });

  it('does not drag when disabled', () => {
    const onValueChange = vi.fn();
    render(<Harness disabled onValueChange={onValueChange} />);

    pointerDown();
    pointerMove(VALUE_DRAG_THRESHOLD + 5);
    pointerUp();

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('opens the property menu on a right click outside text inputs', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness menuItems={[{ kind: 'action', id: 'reset', label: RESET_LABEL, onSelect }]} />);

    fireEvent.contextMenu(field(), { button: 2 });

    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.contextMenu(screen.getByText(LABEL), { button: 2, clientX: 10, clientY: 10 });
    await user.click(await screen.findByRole('menuitem', { name: RESET_LABEL }));

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('indents the label by depth and renders the slots', () => {
    render(
      <PropertyRow label={LABEL} depth={2} leading="*" trailing="r">
        {({ id }) => <TextField id={id} value="" />}
      </PropertyRow>,
    );

    const labelCell = screen.getByText('*').parentElement;

    expect(labelCell?.style.paddingInlineStart).toBe('calc(var(--space-12) * 2)');
    expect(screen.getByText('r')).toBeDefined();
    expect(screen.getByLabelText(LABEL)).toBeDefined();
  });
});
