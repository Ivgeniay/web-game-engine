import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE, POPUP_LAYER_ID } from '@/ui/popup/popupLayerAttributes';
import { PopupLayer } from '@/ui/popup/PopupLayer';
import { Tooltip } from './Tooltip';
import { TOOLTIP_DELAY, TOOLTIP_GROUP_TIMEOUT_MS } from './tooltipTiming';

const CONTENT = 'Frame selected';
const SHORTCUT = 'F';
const FIRST = 'First';
const SECOND = 'Second';
const SECOND_CONTENT = 'Second hint';
const LESS_THAN_DELAY_MS = TOOLTIP_DELAY.open - 1;
const GROUP_PAUSE_MS = TOOLTIP_GROUP_TIMEOUT_MS - 1;

function hover(element: HTMLElement): void {
  fireEvent.mouseEnter(element);
}

function unhover(element: HTMLElement): void {
  fireEvent.mouseLeave(element);
}

function focus(element: HTMLElement): void {
  act(() => {
    element.focus();
  });
}

function pressEscape(): void {
  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
}

function wait(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function trigger(name = FIRST): HTMLElement {
  return screen.getByRole('button', { name });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

beforeEach(() => {
  vi.useFakeTimers();
});

describe('Tooltip', () => {
  it('shows after the hover delay and hides when the pointer leaves', () => {
    render(<Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>);

    hover(trigger());
    wait(LESS_THAN_DELAY_MS);
    expect(screen.queryByRole('tooltip')).toBeNull();

    wait(1);
    expect(screen.getByRole('tooltip').textContent).toBe(CONTENT);

    unhover(trigger());
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows on keyboard focus without delay and hides with Esc', () => {
    render(<Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>);

    focus(trigger());
    expect(screen.getByRole('tooltip')).toBeDefined();
    expect(document.activeElement).toBe(trigger());

    pressEscape();
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('describes the trigger and lives in the popup layer', () => {
    render(
      <Tooltip content={CONTENT} shortcut={SHORTCUT}>
        {(props) => <button {...props}>{FIRST}</button>}
      </Tooltip>,
    );

    focus(trigger());
    const tooltip = screen.getByRole('tooltip');

    expect(trigger().getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(tooltip.parentElement?.closest(`#${POPUP_LAYER_ID}`)).not.toBeNull();
    expect(tooltip.querySelector('kbd')?.textContent).toBe(SHORTCUT);
  });

  it('does not describe the trigger when asked not to', () => {
    render(
      <Tooltip content={CONTENT} describe={false}>
        {(props) => <button {...props}>{FIRST}</button>}
      </Tooltip>,
    );

    focus(trigger());

    expect(screen.getByRole('tooltip')).toBeDefined();
    expect(trigger().hasAttribute('aria-describedby')).toBe(false);
  });

  it('hides when the trigger is pressed', () => {
    render(<Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>);

    hover(trigger());
    wait(TOOLTIP_DELAY.open);
    fireEvent.pointerDown(trigger());

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('stays hidden while disabled', () => {
    render(
      <Tooltip content={CONTENT} disabled>
        {(props) => <button {...props}>{FIRST}</button>}
      </Tooltip>,
    );

    focus(trigger());
    hover(trigger());
    wait(TOOLTIP_DELAY.open);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('stays hidden while a menu or a list is open', () => {
    render(
      <>
        <div {...{ [POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE]: '' }} />
        <Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>
      </>,
    );

    focus(trigger());
    hover(trigger());
    wait(TOOLTIP_DELAY.open);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows the next tooltip at once after another one in the popup layer', () => {
    render(
      <PopupLayer>
        <Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>
        <Tooltip content={SECOND_CONTENT}>
          {(props) => <button {...props}>{SECOND}</button>}
        </Tooltip>
      </PopupLayer>,
    );

    hover(trigger(FIRST));
    wait(TOOLTIP_DELAY.open);
    unhover(trigger(FIRST));
    wait(GROUP_PAUSE_MS);
    hover(trigger(SECOND));
    wait(1);

    expect(screen.getByRole('tooltip').textContent).toBe(SECOND_CONTENT);
  });

  it('waits the full delay again after the group pause is over', () => {
    render(
      <PopupLayer>
        <Tooltip content={CONTENT}>{(props) => <button {...props}>{FIRST}</button>}</Tooltip>
        <Tooltip content={SECOND_CONTENT}>
          {(props) => <button {...props}>{SECOND}</button>}
        </Tooltip>
      </PopupLayer>,
    );

    hover(trigger(FIRST));
    wait(TOOLTIP_DELAY.open);
    unhover(trigger(FIRST));
    wait(TOOLTIP_GROUP_TIMEOUT_MS);
    hover(trigger(SECOND));
    wait(LESS_THAN_DELAY_MS);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
