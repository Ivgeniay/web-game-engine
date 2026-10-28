import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/ui/button/Button';
import type { RovingOrientation } from './rovingFocus';
import { RovingFocusContext } from './rovingFocusContext';
import { useRovingFocusGroup } from './useRovingFocusGroup';

interface TestGroupProps {
  readonly label: string;
  readonly orientation?: RovingOrientation;
  readonly loop?: boolean;
  readonly joinParentGroup?: boolean;
  readonly onNavigate?: (element: HTMLElement) => void;
  readonly children: ReactNode;
}

function TestGroup({
  label,
  orientation = 'horizontal',
  loop = true,
  joinParentGroup = false,
  onNavigate,
  children,
}: TestGroupProps) {
  const { registry, onKeyDown } = useRovingFocusGroup({
    orientation,
    loop,
    joinParentGroup,
    ...(onNavigate === undefined ? {} : { onNavigate }),
  });

  return (
    <RovingFocusContext value={registry}>
      <div role="group" aria-label={label} onKeyDown={onKeyDown}>
        {children}
      </div>
    </RovingFocusContext>
  );
}

const GROUP_LABEL = 'Tools';
const INNER_GROUP_LABEL = 'Modes';
const BEFORE = 'Before';
const AFTER = 'After';
const FIRST = 'Move';
const SECOND = 'Rotate';
const THIRD = 'Scale';
const FOURTH = 'Rect';
const FIELD_LABEL = 'Name';

function button(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

function renderThreeButtons(props: Partial<TestGroupProps> = {}, disabledName?: string) {
  render(
    <>
      <Button>{BEFORE}</Button>
      <TestGroup label={GROUP_LABEL} {...props}>
        {[FIRST, SECOND, THIRD].map((name) => (
          <Button key={name} disabled={name === disabledName}>
            {name}
          </Button>
        ))}
      </TestGroup>
      <Button>{AFTER}</Button>
    </>,
  );
}

afterEach(() => {
  cleanup();
});

describe('roving focus', () => {
  it('makes the group a single Tab stop', async () => {
    const user = userEvent.setup();
    renderThreeButtons();

    await user.tab();
    expect(focused()).toBe(button(BEFORE));
    await user.tab();
    expect(focused()).toBe(button(FIRST));
    await user.tab();
    expect(focused()).toBe(button(AFTER));
    await user.tab({ shift: true });
    expect(focused()).toBe(button(FIRST));
  });

  it('moves focus with arrows and wraps around', async () => {
    const user = userEvent.setup();
    renderThreeButtons();
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(button(SECOND));
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(focused()).toBe(button(FIRST));
    await user.keyboard('{ArrowLeft}');
    expect(focused()).toBe(button(THIRD));
  });

  it('stops at the ends without looping', async () => {
    const user = userEvent.setup();
    renderThreeButtons({ loop: false });
    button(THIRD).focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(button(THIRD));
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    renderThreeButtons();
    button(SECOND).focus();

    await user.keyboard('{End}');
    expect(focused()).toBe(button(THIRD));
    await user.keyboard('{Home}');
    expect(focused()).toBe(button(FIRST));
  });

  it('uses Up and Down in a vertical group', async () => {
    const user = userEvent.setup();
    renderThreeButtons({ orientation: 'vertical' });
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(button(FIRST));
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(button(SECOND));
    await user.keyboard('{ArrowUp}');
    expect(focused()).toBe(button(FIRST));
  });

  it('skips disabled items', async () => {
    const user = userEvent.setup();
    renderThreeButtons({}, SECOND);
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(button(THIRD));
  });

  it('makes the first enabled item the Tab stop', async () => {
    const user = userEvent.setup();
    renderThreeButtons({}, FIRST);

    await user.tab();
    await user.tab();
    expect(focused()).toBe(button(SECOND));
  });

  it('returns Tab to the item focused last', async () => {
    const user = userEvent.setup();
    renderThreeButtons();
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}{ArrowRight}');
    await user.tab();
    expect(focused()).toBe(button(AFTER));
    await user.tab({ shift: true });
    expect(focused()).toBe(button(THIRD));
    expect(button(THIRD).tabIndex).toBe(0);
    expect(button(FIRST).tabIndex).toBe(-1);
  });

  it('reports the element it moved to', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderThreeButtons({ onNavigate });
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}');
    expect(onNavigate).toHaveBeenCalledWith(button(SECOND));
  });

  it('leaves arrows to text fields inside the group', async () => {
    const user = userEvent.setup();
    render(
      <TestGroup label={GROUP_LABEL}>
        <Button>{FIRST}</Button>
        <input aria-label={FIELD_LABEL} defaultValue={FIELD_LABEL} />
        <Button>{SECOND}</Button>
      </TestGroup>,
    );
    const field = screen.getByRole('textbox');
    field.focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(field);
  });

  it('leaves arrows alone when an item already handled them', async () => {
    const user = userEvent.setup();
    render(
      <TestGroup label={GROUP_LABEL}>
        <Button
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        >
          {FIRST}
        </Button>
        <Button>{SECOND}</Button>
      </TestGroup>,
    );
    button(FIRST).focus();

    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(button(FIRST));
  });

  it('lets a nested group join the parent group', async () => {
    const user = userEvent.setup();
    render(
      <TestGroup label={GROUP_LABEL}>
        <Button>{FIRST}</Button>
        <TestGroup label={INNER_GROUP_LABEL} joinParentGroup>
          <Button>{SECOND}</Button>
          <Button>{THIRD}</Button>
        </TestGroup>
        <Button>{FOURTH}</Button>
      </TestGroup>,
    );

    await user.tab();
    expect(focused()).toBe(button(FIRST));
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(focused()).toBe(button(FOURTH));
    await user.tab({ shift: true });
    expect(focused()).toBe(document.body);
  });

  it('keeps a nested group separate unless it joins', async () => {
    const user = userEvent.setup();
    render(
      <TestGroup label={GROUP_LABEL}>
        <Button>{FIRST}</Button>
        <TestGroup label={INNER_GROUP_LABEL} orientation="vertical">
          <Button>{SECOND}</Button>
          <Button>{THIRD}</Button>
        </TestGroup>
      </TestGroup>,
    );
    button(SECOND).focus();

    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(button(THIRD));
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(button(SECOND));
    await user.tab({ shift: true });
    expect(focused()).toBe(button(FIRST));
  });

  it('leaves the Tab order alone outside a group', () => {
    render(<Button>{FIRST}</Button>);

    expect(button(FIRST).hasAttribute('tabindex')).toBe(false);
  });
});
