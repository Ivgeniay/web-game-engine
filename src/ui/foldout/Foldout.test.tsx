import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Foldout } from './Foldout';

const OUTER = 'Rendering';
const MIDDLE = 'Shadows';
const INNER = 'Cascades';
const CONTENT = 'Cascade count';
const SIBLING = 'Lighting';

interface ControlledFoldoutProps {
  readonly label: string;
  readonly initial?: boolean;
  readonly disabled?: boolean;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly children: ReactNode;
}

function ControlledFoldout({
  label,
  initial = false,
  disabled,
  onExpandedChange,
  children,
}: ControlledFoldoutProps) {
  const [expanded, setExpanded] = useState(initial);

  return (
    <Foldout
      label={label}
      expanded={expanded}
      disabled={disabled}
      onExpandedChange={(next) => {
        setExpanded(next);
        onExpandedChange?.(next);
      }}
    >
      {children}
    </Foldout>
  );
}

function NestedFoldouts() {
  return (
    <>
      <ControlledFoldout label={OUTER}>
        <ControlledFoldout label={MIDDLE}>
          <ControlledFoldout label={INNER}>{CONTENT}</ControlledFoldout>
        </ControlledFoldout>
      </ControlledFoldout>
      <ControlledFoldout label={SIBLING}>{CONTENT}</ControlledFoldout>
    </>
  );
}

afterEach(cleanup);

function header(name: string): HTMLElement {
  return screen.getByRole('button', { name, hidden: true });
}

function isExpanded(name: string): boolean {
  return header(name).getAttribute('aria-expanded') === 'true';
}

function contentOf(name: string): HTMLElement {
  const id = header(name).getAttribute('aria-controls');
  const content = id === null ? null : document.getElementById(id);

  if (content === null) {
    throw new Error(`Foldout ${name} has no content`);
  }

  return content;
}

describe('Foldout', () => {
  it('links the header to the content and keeps the collapsed content mounted', () => {
    render(<ControlledFoldout label={OUTER}>{CONTENT}</ControlledFoldout>);

    expect(isExpanded(OUTER)).toBe(false);
    expect(contentOf(OUTER).hidden).toBe(true);
    expect(contentOf(OUTER).textContent).toBe(CONTENT);
  });

  it('toggles on a click', async () => {
    const user = userEvent.setup();
    render(<ControlledFoldout label={OUTER}>{CONTENT}</ControlledFoldout>);

    await user.click(header(OUTER));

    expect(isExpanded(OUTER)).toBe(true);
    expect(contentOf(OUTER).hidden).toBe(false);

    await user.click(header(OUTER));

    expect(isExpanded(OUTER)).toBe(false);
  });

  it('toggles with Enter and Space and opens and closes with the arrows', async () => {
    const user = userEvent.setup();
    render(<ControlledFoldout label={OUTER}>{CONTENT}</ControlledFoldout>);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(isExpanded(OUTER)).toBe(true);

    await user.keyboard(' ');

    expect(isExpanded(OUTER)).toBe(false);

    await user.keyboard('{ArrowRight}');

    expect(isExpanded(OUTER)).toBe(true);

    await user.keyboard('{ArrowLeft}');

    expect(isExpanded(OUTER)).toBe(false);
  });

  it('expands and collapses the nested foldouts with Alt+click', () => {
    render(<NestedFoldouts />);

    fireEvent.click(header(OUTER), { altKey: true });

    expect(isExpanded(OUTER)).toBe(true);
    expect(isExpanded(MIDDLE)).toBe(true);
    expect(isExpanded(INNER)).toBe(true);
    expect(isExpanded(SIBLING)).toBe(false);

    fireEvent.click(header(MIDDLE));

    expect(isExpanded(INNER)).toBe(true);

    fireEvent.click(header(OUTER), { altKey: true });

    expect(isExpanded(OUTER)).toBe(false);
    expect(isExpanded(MIDDLE)).toBe(false);
    expect(isExpanded(INNER)).toBe(false);
  });

  it('changes only its own state on a plain click', () => {
    render(<NestedFoldouts />);

    fireEvent.click(header(OUTER));

    expect(isExpanded(OUTER)).toBe(true);
    expect(isExpanded(MIDDLE)).toBe(false);
  });

  it('does not react when disabled', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <ControlledFoldout label={OUTER} disabled onExpandedChange={onExpandedChange}>
        {CONTENT}
      </ControlledFoldout>,
    );

    await user.click(header(OUTER));
    await user.tab();

    expect(onExpandedChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  });
});
