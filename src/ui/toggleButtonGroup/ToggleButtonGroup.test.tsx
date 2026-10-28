import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import { ToggleButtonGroup } from './ToggleButtonGroup';
import type { ToggleButtonGroupOption } from './ToggleButtonGroup';

type Tool = 'move' | 'rotate' | 'scale';

const GROUP_LABEL = 'Tool';
const OUTER_LABEL = 'Scene toolbar';
const BEFORE = 'Before';
const AFTER = 'After';
const HAND = 'Hand';

const OPTIONS: readonly ToggleButtonGroupOption<Tool>[] = [
  { value: 'move', label: 'Move' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'scale', label: 'Scale' },
];

function option(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

afterEach(() => {
  cleanup();
});

describe('ToggleButtonGroup', () => {
  it('is a labelled group of toggle buttons', () => {
    render(
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={OPTIONS}
        selection="single"
        value="rotate"
        onValueChange={vi.fn()}
      />,
    );

    const group = screen.getByRole('group', { name: GROUP_LABEL });
    const buttons = within(group).getAllByRole('button');

    expect(buttons.map((button) => button.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
    ]);
    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(screen.queryByRole('radio')).toBeNull();
  });

  describe('single selection', () => {
    it('selects the clicked option', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="single"
          value="move"
          onValueChange={onValueChange}
        />,
      );

      await user.click(option('Scale'));
      await user.click(option('Move'));

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('scale');
    });
  });

  describe('optional selection', () => {
    it('selects the clicked option and clears it on a second click', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="optional"
          value="move"
          onValueChange={onValueChange}
        />,
      );

      await user.click(option('Rotate'));
      await user.click(option('Move'));

      expect(onValueChange.mock.calls).toEqual([['rotate'], [null]]);
    });

    it('presses nothing for an empty value', () => {
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="optional"
          value={null}
          onValueChange={vi.fn()}
        />,
      );

      expect(screen.queryAllByRole('button', { pressed: true })).toEqual([]);
    });
  });

  describe('multiple selection', () => {
    it('adds and removes options in the order of the options', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="multiple"
          value={['scale']}
          onValueChange={onValueChange}
        />,
      );

      await user.click(option('Move'));
      await user.click(option('Scale'));

      expect(onValueChange.mock.calls).toEqual([[['move', 'scale']], [[]]]);
      expect(option('Scale').getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('keyboard', () => {
    it('is one Tab stop that starts at the selected option', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Button>{BEFORE}</Button>
          <ToggleButtonGroup
            label={GROUP_LABEL}
            options={OPTIONS}
            selection="single"
            value="rotate"
            onValueChange={vi.fn()}
          />
          <Button>{AFTER}</Button>
        </>,
      );

      await user.tab();
      await user.tab();
      expect(focused()).toBe(option('Rotate'));
      await user.tab();
      expect(focused()).toBe(option(AFTER));
    });

    it('moves focus with arrows without selecting and selects with Space and Enter', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="single"
          value="move"
          onValueChange={onValueChange}
        />,
      );

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(focused()).toBe(option('Rotate'));
      expect(onValueChange).not.toHaveBeenCalled();

      await user.keyboard(' ');
      await user.keyboard('{ArrowRight}{Enter}');
      expect(onValueChange.mock.calls).toEqual([['rotate'], ['scale']]);
    });

    it('skips disabled options', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS.map((item) => ({ ...item, disabled: item.value === 'rotate' }))}
          selection="single"
          value="move"
          onValueChange={onValueChange}
        />,
      );

      await user.click(option('Rotate'));
      await user.tab();
      await user.keyboard('{ArrowRight}');

      expect(focused()).toBe(option('Scale'));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('disables every option when the group is disabled', () => {
      render(
        <ToggleButtonGroup
          label={GROUP_LABEL}
          options={OPTIONS}
          selection="single"
          value="move"
          onValueChange={vi.fn()}
          disabled
        />,
      );

      for (const button of screen.getAllByRole('button')) {
        expect(button).toHaveProperty('disabled', true);
      }
    });

    it('joins a surrounding roving focus group', async () => {
      const user = userEvent.setup();

      function OuterGroup() {
        const { registry, onKeyDown } = useRovingFocusGroup({ orientation: 'horizontal' });

        return (
          <RovingFocusContext value={registry}>
            <div role="toolbar" aria-label={OUTER_LABEL} onKeyDown={onKeyDown}>
              <Button>{HAND}</Button>
              <ToggleButtonGroup
                label={GROUP_LABEL}
                options={OPTIONS}
                selection="single"
                value="move"
                onValueChange={vi.fn()}
              />
            </div>
          </RovingFocusContext>
        );
      }

      render(<OuterGroup />);

      await user.tab();
      expect(focused()).toBe(option('Move'));
      await user.keyboard('{ArrowLeft}');
      expect(focused()).toBe(option(HAND));
      await user.keyboard('{End}');
      expect(focused()).toBe(option('Scale'));
      await user.tab();
      expect(focused()).toBe(document.body);
    });
  });

  it('shows icon-only options with the label as their name', () => {
    render(
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={[{ value: 'move', label: 'Move', icon: frameworkIcons.plus, iconOnly: true }]}
        selection="single"
        value="move"
        onValueChange={vi.fn()}
      />,
    );

    const button = option('Move');

    expect(button.textContent).toBe('');
    expect(button.getAttribute('title')).toBe('Move');
  });

  it('passes the language of an option to its button', () => {
    render(
      <ToggleButtonGroup
        label={GROUP_LABEL}
        options={[{ value: 'move', label: 'Move', lang: 'en' }]}
        selection="single"
        value="move"
        onValueChange={vi.fn()}
      />,
    );

    expect(option('Move').getAttribute('lang')).toBe('en');
  });
});
