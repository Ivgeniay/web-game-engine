import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Bounds } from '@/contracts/geometry';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { BoundsField } from './BoundsField';
import type { BoundsMixed } from './BoundsField';

const LABEL = 'Bounds';
const CENTER = 'Center';
const SIZE = 'Size';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const INITIAL: Bounds = { center: [0, 1, 0], size: [2, 2, 2] };

interface HarnessProps {
  readonly mixed?: BoundsMixed;
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<Bounds>;
}

function Harness({ mixed, disabled, onValueChange }: HarnessProps) {
  const [bounds, setBounds] = useState(INITIAL);

  return (
    <PropertyRowGroup>
      <BoundsField
        label={LABEL}
        centerLabel={CENTER}
        sizeLabel={SIZE}
        value={bounds}
        mixed={mixed}
        disabled={disabled}
        invalidMessages={MESSAGES}
        onValueChange={(next, phase) => {
          setBounds(next);
          onValueChange?.(next, phase);
        }}
      />
    </PropertyRowGroup>
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

function component(row: string, axis: string): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name: `${LABEL} ${row} ${axis}` });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`No component ${row} ${axis}`);
  }

  return element;
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('BoundsField', () => {
  it('shows a caption and two rows of three components', () => {
    render(<Harness />);

    expect(screen.getByRole('group', { name: LABEL })).toBeDefined();
    expect(component(CENTER, 'Y').value).toBe('1');
    expect(component(SIZE, 'Z').value).toBe('2');
  });

  it('replaces the center or the size', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(component(SIZE, 'X'));
    await user.type(component(SIZE, 'X'), '4{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(
      { center: [0, 1, 0], size: [4, 2, 2] },
      'commit',
    );
  });

  it('focuses the first center component from its caption', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByText(CENTER));

    expect(document.activeElement).toBe(component(CENTER, 'X'));
  });

  it('shows mixed components and disables both rows', () => {
    const { unmount } = render(<Harness mixed={{ center: [false, true, false] }} />);

    expect(component(CENTER, 'Y').placeholder).toBe('—');
    unmount();

    render(<Harness disabled />);

    expect(component(CENTER, 'X').disabled).toBe(true);
    expect(component(SIZE, 'Z').disabled).toBe(true);
  });
});
