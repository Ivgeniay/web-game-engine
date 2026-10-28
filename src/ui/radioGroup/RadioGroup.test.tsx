import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/ui/button/Button';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupOption, RadioGroupOrientation } from './RadioGroup';

type Quality = 'low' | 'medium' | 'high';

const GROUP_LABEL = 'Quality';
const BEFORE = 'Before';
const AFTER = 'After';

const OPTIONS: readonly RadioGroupOption<Quality>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function radio(name: string): HTMLElement {
  return screen.getByRole('radio', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

interface StatefulGroupProps {
  readonly initial: Quality | null;
  readonly options?: readonly RadioGroupOption<Quality>[];
  readonly orientation?: RadioGroupOrientation;
  readonly onValueChange?: (value: Quality) => void;
}

function StatefulGroup({
  initial,
  options = OPTIONS,
  orientation = 'vertical',
  onValueChange,
}: StatefulGroupProps) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <Button>{BEFORE}</Button>
      <RadioGroup
        label={GROUP_LABEL}
        options={options}
        value={value}
        orientation={orientation}
        onValueChange={(next) => {
          setValue(next);
          onValueChange?.(next);
        }}
      />
      <Button>{AFTER}</Button>
    </>
  );
}

afterEach(() => {
  cleanup();
});

describe('RadioGroup', () => {
  it('is a labelled radio group of native radio buttons', () => {
    render(
      <RadioGroup label={GROUP_LABEL} options={OPTIONS} value="medium" onValueChange={vi.fn()} />,
    );

    const group = screen.getByRole('radiogroup', { name: GROUP_LABEL });
    const radios = within(group).getAllByRole('radio');
    const names = new Set(radios.map((element) => element.getAttribute('name')));

    expect(radios.map((element) => element.getAttribute('type'))).toEqual([
      'radio',
      'radio',
      'radio',
    ]);
    expect(radio('Medium')).toHaveProperty('checked', true);
    expect(radio('Low')).toHaveProperty('checked', false);
    expect(names.size).toBe(1);
  });

  it('selects the clicked option and its label', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label={GROUP_LABEL}
        options={OPTIONS}
        value="low"
        onValueChange={onValueChange}
      />,
    );

    await user.click(radio('High'));
    await user.click(screen.getByText('Medium'));

    expect(onValueChange.mock.calls).toEqual([['high'], ['medium']]);
  });

  it('is one Tab stop that starts at the selected option', async () => {
    const user = userEvent.setup();
    render(<StatefulGroup initial="medium" />);

    await user.tab();
    await user.tab();
    expect(focused()).toBe(radio('Medium'));
    await user.tab();
    expect(focused()).toBe(screen.getByRole('button', { name: AFTER }));
  });

  it('starts at the first option when nothing is selected and selects it with Space', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<StatefulGroup initial={null} onValueChange={onValueChange} />);

    await user.tab();
    await user.tab();
    expect(focused()).toBe(radio('Low'));
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard(' ');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('low');
  });

  it.each(['vertical', 'horizontal'] as const)(
    'selects with arrows of both axes in a %s group and wraps around',
    async (orientation) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <StatefulGroup initial="low" orientation={orientation} onValueChange={onValueChange} />,
      );
      radio('Low').focus();

      await user.keyboard('{ArrowDown}');
      expect(focused()).toBe(radio('Medium'));
      expect(radio('Medium')).toHaveProperty('checked', true);
      await user.keyboard('{ArrowRight}');
      expect(radio('High')).toHaveProperty('checked', true);
      await user.keyboard('{ArrowRight}');
      expect(focused()).toBe(radio('Low'));
      await user.keyboard('{ArrowUp}{ArrowLeft}');
      expect(focused()).toBe(radio('Medium'));

      expect(onValueChange.mock.calls).toEqual([
        ['medium'],
        ['high'],
        ['low'],
        ['high'],
        ['medium'],
      ]);
    },
  );

  it.each(['vertical', 'horizontal'] as const)(
    'handles arrows of both axes itself in a %s group instead of the browser',
    (orientation) => {
      render(<StatefulGroup initial="low" orientation={orientation} />);

      for (const key of ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']) {
        const browserMayHandle = fireEvent.keyDown(radio('Low'), { key });

        expect(browserMayHandle, key).toBe(false);
      }
    },
  );

  it('skips disabled options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <StatefulGroup
        initial="low"
        options={OPTIONS.map((option) => ({ ...option, disabled: option.value === 'medium' }))}
        onValueChange={onValueChange}
      />,
    );

    await user.click(radio('Medium'));
    radio('Low').focus();
    await user.keyboard('{ArrowDown}');

    expect(focused()).toBe(radio('High'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('high');
  });

  it('ignores the mouse and the keyboard when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label={GROUP_LABEL}
        options={OPTIONS}
        value="low"
        onValueChange={onValueChange}
        disabled
      />,
    );

    await user.click(radio('High'));
    await user.tab();

    for (const element of screen.getAllByRole('radio')) {
      expect(element).toHaveProperty('disabled', true);
    }
    expect(focused()).toBe(document.body);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('passes the language of an option to its label', () => {
    render(
      <RadioGroup
        label={GROUP_LABEL}
        options={[{ value: 'low', label: 'Низкое', lang: 'ru' }]}
        value="low"
        onValueChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Низкое').closest('label')?.getAttribute('lang')).toBe('ru');
  });
});
