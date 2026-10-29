import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isTooltipBlocked } from '@/ui/popup/popupLayerAttributes';
import { DragAndDropLayer } from './DragAndDropLayer';
import type { DragData } from './dragData';
import { DRAG_START_THRESHOLD, useDragSource } from './useDragSource';
import { useDropTarget } from './useDropTarget';

const ASSET_TYPE = 'asset';
const OTHER_TYPE = 'other';
const SOURCE_LABEL = 'Texture source';
const TARGET_LABEL = 'Material slot';
const DATA: DragData = { type: ASSET_TYPE, ids: ['texture'], label: 'Grass.png' };
const START = { clientX: 10, clientY: 10 };
const NEAR_START = { clientX: 10 + DRAG_START_THRESHOLD - 1, clientY: 10 };
const OVER_TARGET = { clientX: 200, clientY: 10 };
const TARGET_LEFT = 100;

interface HarnessProps {
  readonly data?: DragData | null;
  readonly accepts?: readonly string[];
  readonly onDrop?: (data: DragData) => void;
  readonly onSourceClick?: () => void;
}

interface SourceProps {
  readonly data: DragData | null;
  readonly onClick: () => void;
}

interface TargetProps {
  readonly accepts: readonly string[];
  readonly onDrop: (data: DragData) => void;
}

function Source({ data, onClick }: SourceProps) {
  const { startDrag } = useDragSource();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={SOURCE_LABEL}
      onPointerDown={(event) => {
        startDrag(event, () => data);
      }}
      onClick={onClick}
    />
  );
}

function Target({ accepts, onDrop }: TargetProps) {
  const { dropTargetProps, isOver } = useDropTarget({
    accepts,
    onDragOver: () => true,
    onDrop,
  });

  return (
    <div
      role="region"
      aria-label={TARGET_LABEL}
      data-over={isOver || undefined}
      {...dropTargetProps}
    />
  );
}

function Harness({
  data = DATA,
  accepts = [ASSET_TYPE],
  onDrop = vi.fn(),
  onSourceClick = vi.fn(),
}: HarnessProps) {
  return (
    <DragAndDropLayer>
      <Source data={data} onClick={onSourceClick} />
      <Target accepts={accepts} onDrop={onDrop} />
    </DragAndDropLayer>
  );
}

function source(): HTMLElement {
  return screen.getByRole('button', { name: SOURCE_LABEL });
}

function target(): HTMLElement {
  return screen.getByRole('region', { name: TARGET_LABEL });
}

function preview(): HTMLElement | null {
  return screen.queryByText(DATA.label);
}

beforeEach(() => {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: (clientX: number) => (clientX >= TARGET_LEFT ? target() : source()),
  });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, 'elementFromPoint');
});

function press(point = START): void {
  fireEvent.pointerDown(source(), { ...point, button: 0 });
}

function move(point: { readonly clientX: number; readonly clientY: number }): void {
  fireEvent.pointerMove(window, point);
}

function release(point = OVER_TARGET): void {
  fireEvent.pointerUp(window, point);
}

describe('drag and drop', () => {
  it('starts only after the pointer passes the threshold', () => {
    render(<Harness />);

    press();
    move(NEAR_START);

    expect(preview()).toBeNull();

    move(OVER_TARGET);

    expect(preview()?.textContent).toBe(DATA.label);
  });

  it('shows the target under the pointer and drops the data there', () => {
    const onDrop = vi.fn();
    render(<Harness onDrop={onDrop} />);

    press();
    move(OVER_TARGET);

    expect(target().hasAttribute('data-over')).toBe(true);
    expect(preview()?.hasAttribute('data-allowed')).toBe(true);

    release();

    expect(onDrop).toHaveBeenCalledExactlyOnceWith(DATA, OVER_TARGET);
    expect(preview()).toBeNull();
    expect(target().hasAttribute('data-over')).toBe(false);
  });

  it('does not offer a target that does not accept the type', () => {
    const onDrop = vi.fn();
    render(<Harness accepts={[OTHER_TYPE]} onDrop={onDrop} />);

    press();
    move(OVER_TARGET);

    expect(target().hasAttribute('data-over')).toBe(false);
    expect(preview()?.hasAttribute('data-allowed')).toBe(false);

    release();

    expect(onDrop).not.toHaveBeenCalled();
  });

  it('cancels with Esc and ignores the release after that', () => {
    const onDrop = vi.fn();
    render(<Harness onDrop={onDrop} />);

    press();
    move(OVER_TARGET);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(preview()).toBeNull();

    release();

    expect(onDrop).not.toHaveBeenCalled();
  });

  it('swallows the click that follows a drag', () => {
    vi.useFakeTimers();
    const onSourceClick = vi.fn();
    render(<Harness onSourceClick={onSourceClick} />);

    press();
    move(OVER_TARGET);
    release();
    fireEvent.click(source());

    expect(onSourceClick).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });
    fireEvent.click(source());

    expect(onSourceClick).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('does not start when the source gives no data', () => {
    render(<Harness data={null} />);

    press();
    move(OVER_TARGET);

    expect(screen.queryByText(DATA.label)).toBeNull();
  });

  it('blocks the tooltips while dragging', () => {
    render(<Harness />);

    press();
    move(OVER_TARGET);

    expect(isTooltipBlocked(document)).toBe(true);

    release();

    expect(isTooltipBlocked(document)).toBe(false);
  });

  it('requires the layer only when drag and drop is enabled', () => {
    function DisabledTarget() {
      useDropTarget({ enabled: false, accepts: [], onDragOver: () => false, onDrop: vi.fn() });

      return null;
    }

    expect(() => render(<DisabledTarget />)).not.toThrow();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Source data={DATA} onClick={vi.fn()} />)).toThrow(/DragAndDropLayer/);
    vi.restoreAllMocks();
  });
});
