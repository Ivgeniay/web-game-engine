import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PropertyRowGroup } from './PropertyRowGroup';

const GROUP_WIDTH = 300;
const LABEL_MIN = 48;
const FIELD_MIN = 60;
const POINTER_ID = 1;
const ROW_TEXT = 'row';

function renderGroup(): { group: HTMLElement; splitter: HTMLElement } {
  const { container } = render(
    <PropertyRowGroup>
      <div>{ROW_TEXT}</div>
    </PropertyRowGroup>,
  );
  const group = container.firstElementChild;
  const splitter = group?.lastElementChild;

  if (!(group instanceof HTMLElement) || !(splitter instanceof HTMLElement)) {
    throw new Error('PropertyRowGroup did not render a splitter');
  }

  return { group, splitter };
}

function drag(splitter: HTMLElement, offset: number): void {
  fireEvent.pointerDown(splitter, { button: 0, pointerId: POINTER_ID, clientX: 0 });
  fireEvent.pointerMove(splitter, { pointerId: POINTER_ID, clientX: offset });
  fireEvent.pointerUp(splitter, { pointerId: POINTER_ID });
}

beforeEach(() => {
  document.documentElement.style.setProperty('--size-property-label-min', `${String(LABEL_MIN)}px`);
  document.documentElement.style.setProperty('--size-property-field-min', `${String(FIELD_MIN)}px`);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => GROUP_WIDTH);
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(() => 100);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(() => 0);
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('style');
});

describe('PropertyRowGroup', () => {
  it('renders the rows and a hidden splitter', () => {
    const { group, splitter } = renderGroup();

    expect(group.textContent).toBe(ROW_TEXT);
    expect(splitter.getAttribute('aria-hidden')).toBe('true');
  });

  it('sets the label width by dragging the splitter', () => {
    const { group, splitter } = renderGroup();

    drag(splitter, 40);

    expect(group.style.getPropertyValue('--property-label-width')).toBe('140px');
  });

  it('keeps the label and the field above their minimum widths', () => {
    const { group, splitter } = renderGroup();

    drag(splitter, -500);

    expect(group.style.getPropertyValue('--property-label-width')).toBe(`${String(LABEL_MIN)}px`);

    drag(splitter, 500);

    expect(group.style.getPropertyValue('--property-label-width')).toBe(
      `${String(GROUP_WIDTH - FIELD_MIN)}px`,
    );
  });
});
