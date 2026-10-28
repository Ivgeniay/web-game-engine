import { act, cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Label } from './Label';

const TEXT = 'Position of the selected object';
const FIELD_ID = 'position';
const FULL_WIDTH = 200;
const NARROW_WIDTH = 80;

let resizeCallbacks: (() => void)[] = [];
let contentWidth = FULL_WIDTH;
let boxWidth = FULL_WIDTH;

class FakeResizeObserver {
  private readonly callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;
  }

  observe(): void {
    resizeCallbacks.push(this.callback);
  }

  disconnect(): void {
    resizeCallbacks = resizeCallbacks.filter((callback) => callback !== this.callback);
  }
}

function resizeBox(width: number): void {
  boxWidth = width;
  act(() => {
    for (const callback of resizeCallbacks) {
      callback();
    }
  });
}

beforeEach(() => {
  resizeCallbacks = [];
  contentWidth = FULL_WIDTH;
  boxWidth = FULL_WIDTH;
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => contentWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => boxWidth);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Label', () => {
  it('shows text that cannot be focused', () => {
    render(<Label>{TEXT}</Label>);

    const label = screen.getByText(TEXT);

    expect(label.tagName).toBe('SPAN');
    expect(label.hasAttribute('tabindex')).toBe(false);
    expect(label.hasAttribute('title')).toBe(false);
  });

  it('labels a field with htmlFor', () => {
    render(
      <>
        <Label htmlFor={FIELD_ID}>{TEXT}</Label>
        <input id={FIELD_ID} />
      </>,
    );

    expect(screen.getByLabelText(TEXT).id).toBe(FIELD_ID);
    expect(screen.getByText(TEXT).tagName).toBe('LABEL');
  });

  it('shows the full text as a hint only while the text is cut off', () => {
    render(<Label truncate>{TEXT}</Label>);
    const label = screen.getByText(TEXT);

    expect(label.hasAttribute('title')).toBe(false);

    resizeBox(NARROW_WIDTH);
    expect(label.getAttribute('title')).toBe(TEXT);

    resizeBox(FULL_WIDTH);
    expect(label.hasAttribute('title')).toBe(false);
  });

  it('does not watch the size without truncation', () => {
    contentWidth = FULL_WIDTH;
    boxWidth = NARROW_WIDTH;
    render(<Label>{TEXT}</Label>);

    expect(resizeCallbacks).toEqual([]);
    expect(screen.getByText(TEXT).hasAttribute('title')).toBe(false);
  });

  it('stops watching the size when it unmounts', () => {
    const { unmount } = render(<Label truncate>{TEXT}</Label>);

    expect(resizeCallbacks).toHaveLength(1);
    unmount();
    expect(resizeCallbacks).toEqual([]);
  });

  it('passes the element to ref and the id to the element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Label ref={ref} id={FIELD_ID}>
        {TEXT}
      </Label>,
    );

    expect(ref.current).toBe(screen.getByText(TEXT));
    expect(ref.current?.id).toBe(FIELD_ID);
  });
});
