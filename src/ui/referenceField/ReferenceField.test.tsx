import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragData } from '@/contracts/dragData';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { DragAndDropLayer } from '@/ui/dragAndDrop/DragAndDropLayer';
import { useDragSource } from '@/ui/dragAndDrop/useDragSource';
import { ReferenceField } from './ReferenceField';

const LABEL = 'Material';
const LABELS = { none: 'None', openPicker: 'Press Enter to choose', clear: 'Clear' };
const NAMES: Readonly<Record<string, string>> = { rock: 'Rock.mat', ground: 'Ground.mat' };
const ASSET_TYPE = 'test.asset';
const SOURCE_LABEL = 'Ground asset';
const TARGET_LEFT = 100;

function nameOf(id: string): string {
  return NAMES[id] ?? id;
}

function resolveMaterial(data: DragData): string | null {
  const [id] = data.ids;

  return id !== undefined && id in NAMES ? id : null;
}

interface HarnessProps {
  readonly initial?: string | null;
  readonly mixed?: boolean;
  readonly readOnly?: boolean;
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<string | null>;
  readonly onOpenPicker?: () => void;
}

function Harness({
  initial = 'rock',
  mixed,
  readOnly,
  disabled,
  onValueChange,
  onOpenPicker = vi.fn(),
}: HarnessProps) {
  const [value, setValue] = useState(initial);

  return (
    <ReferenceField
      aria-label={LABEL}
      value={value}
      mixed={mixed}
      readOnly={readOnly}
      disabled={disabled}
      getLabel={nameOf}
      getIcon={() => frameworkIcons.file}
      labels={LABELS}
      dropTypes={[ASSET_TYPE]}
      resolveDrop={resolveMaterial}
      onOpenPicker={onOpenPicker}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function DragSource({ data }: { readonly data: DragData }) {
  const { startDrag } = useDragSource();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={SOURCE_LABEL}
      onPointerDown={(event) => {
        startDrag(event, () => data);
      }}
    />
  );
}

function show(props: HarnessProps = {}) {
  return render(
    <DragAndDropLayer>
      <Harness {...props} />
    </DragAndDropLayer>,
  );
}

function field(): HTMLElement {
  return screen.getByRole('button', { name: LABEL });
}

afterEach(cleanup);

describe('ReferenceField', () => {
  it('shows the name of the target, None without a target and a dash when mixed', () => {
    show();

    expect(field().textContent).toBe('Rock.mat');
    expect(field().getAttribute('aria-haspopup')).toBe('dialog');

    cleanup();
    show({ initial: null });

    expect(field().textContent).toBe('None');

    cleanup();
    show({ mixed: true });

    expect(field().textContent).toBe('—');
  });

  it('opens the picker with a click and with Enter', async () => {
    const user = userEvent.setup();
    const onOpenPicker = vi.fn();
    show({ onOpenPicker });

    await user.click(field());
    field().focus();
    await user.keyboard('{Enter}');

    expect(onOpenPicker).toHaveBeenCalledTimes(2);
  });

  it('clears the reference with Delete and with the clear button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    show({ onValueChange });

    field().focus();
    await user.keyboard('{Delete}');

    expect(onValueChange).toHaveBeenLastCalledWith(null, 'commit');
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();

    cleanup();
    show({ onValueChange });
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(field().textContent).toBe('None');
  });

  it('neither opens nor clears when read-only, and is a disabled button when disabled', async () => {
    const user = userEvent.setup();
    const onOpenPicker = vi.fn();
    const onValueChange = vi.fn();
    show({ readOnly: true, onOpenPicker, onValueChange });

    await user.click(field());
    field().focus();
    await user.keyboard('{Delete}');

    expect(onOpenPicker).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();

    cleanup();
    show({ disabled: true });

    expect(field().hasAttribute('disabled')).toBe(true);
  });

  describe('dropping data', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'elementFromPoint', {
        configurable: true,
        value: (clientX: number) =>
          clientX >= TARGET_LEFT ? field() : screen.getByRole('button', { name: SOURCE_LABEL }),
      });
    });

    afterEach(() => {
      Reflect.deleteProperty(document, 'elementFromPoint');
    });

    function dragTo(data: DragData): void {
      render(
        <DragAndDropLayer>
          <DragSource data={data} />
          <Harness />
        </DragAndDropLayer>,
      );
      fireEvent.pointerDown(screen.getByRole('button', { name: SOURCE_LABEL }), {
        clientX: 10,
        clientY: 10,
        button: 0,
      });
      fireEvent.pointerMove(window, { clientX: 200, clientY: 10 });
      fireEvent.pointerUp(window, { clientX: 200, clientY: 10 });
    }

    it('takes the target from dropped data it accepts', () => {
      dragTo({ type: ASSET_TYPE, ids: ['ground'], label: 'Ground.mat' });

      expect(field().textContent).toBe('Ground.mat');
    });

    it('ignores data it cannot resolve', () => {
      dragTo({ type: ASSET_TYPE, ids: ['texture'], label: 'Sky.png' });

      expect(field().textContent).toBe('Rock.mat');
    });
  });
});
