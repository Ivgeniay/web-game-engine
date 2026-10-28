import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Separator } from '@/ui/separator/Separator';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import { ToggleButtonGroup } from '@/ui/toggleButtonGroup/ToggleButtonGroup';
import { Toolbar } from './Toolbar';

const TOOLBAR_LABEL = 'Scene';
const BEFORE = 'Before';
const AFTER = 'After';
const ADD = 'Add';
const REFRESH = 'Refresh';
const GRID = 'Grid';
const SNAP = 'Snap';
const BUILD = 'Build';
const TOOL_GROUP_LABEL = 'Tool';

function control(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function focused(): Element | null {
  return document.activeElement;
}

function renderToolbar() {
  render(
    <>
      <Button>{BEFORE}</Button>
      <Toolbar label={TOOLBAR_LABEL}>
        <IconButton label={ADD} icon={frameworkIcons.plus} />
        <IconButton label={REFRESH} icon={frameworkIcons.refresh} disabled />
        <Separator orientation="vertical" />
        <ToggleButtonGroup
          label={TOOL_GROUP_LABEL}
          options={[
            { value: 'move', label: 'Move' },
            { value: 'rotate', label: 'Rotate' },
          ]}
          selection="single"
          value="rotate"
          onValueChange={vi.fn()}
        />
        <ToggleButton pressed={false} onPressedChange={vi.fn()}>
          {GRID}
        </ToggleButton>
        <Checkbox checked={false} onCheckedChange={vi.fn()} label={SNAP} />
        <Separator variant="flexible" />
        <Button variant="accent">{BUILD}</Button>
      </Toolbar>
      <Button>{AFTER}</Button>
    </>,
  );
}

afterEach(() => {
  cleanup();
});

describe('Toolbar', () => {
  it('is a labelled horizontal toolbar', () => {
    renderToolbar();

    const toolbar = screen.getByRole('toolbar', { name: TOOLBAR_LABEL });

    expect(toolbar.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('is a single Tab stop for every control inside, starting at the selected option', async () => {
    const user = userEvent.setup();
    renderToolbar();

    await user.tab();
    await user.tab();
    expect(focused()).toBe(control('Rotate'));
    await user.tab();
    expect(focused()).toBe(control(AFTER));
    await user.tab({ shift: true });
    expect(focused()).toBe(control('Rotate'));
  });

  it('moves through all controls with Left and Right and skips disabled ones', async () => {
    const user = userEvent.setup();
    renderToolbar();
    control(ADD).focus();

    const visited: (Element | null)[] = [];
    for (let step = 0; step < 6; step += 1) {
      await user.keyboard('{ArrowRight}');
      visited.push(focused());
    }

    expect(visited).toEqual([
      control('Move'),
      control('Rotate'),
      control(GRID),
      screen.getByRole('checkbox', { name: SNAP }),
      control(BUILD),
      control(ADD),
    ]);
  });

  it('ignores Up and Down', async () => {
    const user = userEvent.setup();
    renderToolbar();
    control(ADD).focus();

    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(control(ADD));
    await user.keyboard('{ArrowUp}');
    expect(focused()).toBe(control(ADD));
  });
});
