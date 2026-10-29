import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { IconButton } from '@/ui/iconButton/IconButton';
import { POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE } from '@/ui/popup/popupLayerAttributes';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { Menu } from './Menu';
import type { MenuItem, MenuNavigationDirection, MenuPoint } from './menuItems';

const MENU_LABEL = 'Edit';
const TRIGGER_LABEL = 'Open edit menu';
const OUTSIDE = 'Outside';
const NEXT_TOOL = 'Next tool';
const POINT: MenuPoint = { x: 40, y: 60 };

interface Handlers {
  readonly undo: () => void;
  readonly redo: () => void;
  readonly duplicate: () => void;
  readonly snap: (checked: boolean) => void;
  readonly pivot: (value: string) => void;
  readonly cube: () => void;
}

function createHandlers(): Handlers {
  return {
    undo: vi.fn(),
    redo: vi.fn(),
    duplicate: vi.fn(),
    snap: vi.fn(),
    pivot: vi.fn(),
    cube: vi.fn(),
  };
}

function createItems(handlers: Handlers): readonly MenuItem[] {
  return [
    { kind: 'section', id: 'history', label: 'History' },
    { kind: 'action', id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', onSelect: handlers.undo },
    { kind: 'action', id: 'redo', label: 'Redo', disabled: true, onSelect: handlers.redo },
    { kind: 'separator', id: 'separator' },
    {
      kind: 'action',
      id: 'duplicate',
      label: 'Duplicate',
      icon: frameworkIcons.copy,
      onSelect: handlers.duplicate,
    },
    {
      kind: 'checkbox',
      id: 'snap',
      label: 'Snap to grid',
      checked: false,
      onCheckedChange: handlers.snap,
    },
    {
      kind: 'radio-group',
      id: 'pivot',
      label: 'Pivot',
      value: 'center',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'pivot', label: 'Pivot point' },
      ],
      onValueChange: handlers.pivot,
    },
    {
      kind: 'submenu',
      id: 'create',
      label: 'Create',
      items: [
        { kind: 'action', id: 'cube', label: 'Cube', onSelect: handlers.cube },
        { kind: 'action', id: 'sphere', label: 'Sphere', onSelect: vi.fn() },
      ],
    },
    {
      kind: 'submenu',
      id: 'align',
      label: 'Align',
      items: [{ kind: 'action', id: 'left', label: 'Left edge', onSelect: vi.fn() }],
    },
  ];
}

interface TriggerHarnessProps {
  readonly handlers: Handlers;
  readonly onNavigateOut?: (direction: MenuNavigationDirection) => void;
}

function TriggerHarness({ handlers, onNavigateOut }: TriggerHarnessProps) {
  return (
    <>
      <Menu
        items={createItems(handlers)}
        onNavigateOut={onNavigateOut}
        trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER_LABEL}</Button>}
      />
      <Button>{OUTSIDE}</Button>
    </>
  );
}

function trigger(): HTMLElement {
  return screen.getByRole('button', { name: TRIGGER_LABEL });
}

function item(name: string): HTMLElement {
  return (
    screen.queryByRole('menuitem', { name }) ??
    screen.queryByRole('menuitemcheckbox', { name }) ??
    screen.getByRole('menuitemradio', { name })
  );
}

async function expectFocusOn(name: string): Promise<void> {
  await waitFor(() => {
    expect(focused()).toBe(item(name));
  });
}

function focused(): Element | null {
  return document.activeElement;
}

async function openWithClick(handlers = createHandlers()) {
  const user = userEvent.setup();
  render(<TriggerHarness handlers={handlers} />);
  await user.click(trigger());
  await expectFocusOn('Undo');

  return { user, handlers };
}

afterEach(() => {
  cleanup();
});

describe('Menu with a trigger', () => {
  it('opens on click with the focus on the first enabled item', async () => {
    const user = userEvent.setup();
    render(<TriggerHarness handlers={createHandlers()} />);

    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger());

    expect(screen.getByRole('menu', { name: TRIGGER_LABEL })).toBeDefined();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    await expectFocusOn('Undo');
  });

  it.each(['{Enter}', ' ', '{ArrowDown}'])('opens from the keyboard with %s', async (key) => {
    const user = userEvent.setup();
    render(<TriggerHarness handlers={createHandlers()} />);

    await user.tab();
    await user.keyboard(key);

    await expectFocusOn('Undo');
  });

  it('moves with arrows around the ends, skips disabled items and jumps with Home and End', async () => {
    const { user } = await openWithClick();

    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(item('Duplicate'));
    await user.keyboard('{End}');
    expect(focused()).toBe(item('Align'));
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe(item('Undo'));
    await user.keyboard('{ArrowUp}');
    expect(focused()).toBe(item('Align'));
    await user.keyboard('{Home}');
    expect(focused()).toBe(item('Undo'));
  });

  it('finds an item by its first letters', async () => {
    const { user } = await openWithClick();

    await user.keyboard('sn');

    expect(focused()).toBe(item('Snap to grid'));
  });

  it.each(['{Enter}', ' '])('runs the item with %s, closes and returns the focus', async (key) => {
    const { user, handlers } = await openWithClick();

    await user.keyboard(key);

    expect(handlers.undo).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(trigger());
  });

  it('runs the item on click', async () => {
    const { user, handlers } = await openWithClick();

    await user.click(item('Duplicate'));

    expect(handlers.duplicate).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('ignores disabled items', async () => {
    const { user, handlers } = await openWithClick();

    await user.click(item('Redo'));

    expect(handlers.redo).not.toHaveBeenCalled();
    expect(item('Redo')).toHaveProperty('disabled', true);
  });

  it('closes with Esc and returns the focus to the trigger', async () => {
    const { user } = await openWithClick();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(trigger());
  });

  it('closes on a click outside', async () => {
    const { user } = await openWithClick();

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes when the trigger is clicked again', async () => {
    const { user } = await openWithClick();

    await user.click(trigger());

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('shows sections, separators, icons and shortcuts', async () => {
    await openWithClick();
    const menu = screen.getByRole('menu');

    expect(within(menu).getByText('History').getAttribute('role')).toBe('presentation');
    expect(within(menu).getByRole('separator')).toBeDefined();
    expect(item('Undo').querySelector('kbd')?.textContent).toBe('Ctrl+Z');
    expect(item('Undo').hasAttribute('aria-checked')).toBe(false);
    expect(item('Duplicate').querySelector('svg')).not.toBeNull();
  });

  it('switches a checkbox item', async () => {
    const { user, handlers } = await openWithClick();
    const snap = screen.getByRole('menuitemcheckbox', { name: 'Snap to grid' });

    expect(snap.getAttribute('aria-checked')).toBe('false');
    await user.click(snap);

    expect(handlers.snap).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('keeps the menu open after a checkbox item that asks for it', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Menu
        items={[
          {
            kind: 'checkbox',
            id: 'gizmos',
            label: 'Gizmos',
            checked: false,
            keepOpen: true,
            onCheckedChange,
          },
          { kind: 'checkbox', id: 'grid', label: 'Grid', checked: 'mixed', onCheckedChange },
        ]}
        trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER_LABEL}</Button>}
      />,
    );

    await user.click(trigger());
    await expectFocusOn('Gizmos');
    await user.keyboard('{Enter}');

    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('menu')).toBeDefined();
    expect(focused()).toBe(item('Gizmos'));

    expect(item('Grid').getAttribute('aria-checked')).toBe('mixed');
    expect(item('Grid').querySelector('svg')).not.toBeNull();
    await user.click(item('Grid'));

    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('chooses a radio item in its group', async () => {
    const { user, handlers } = await openWithClick();
    const group = screen.getByRole('group', { name: 'Pivot' });
    const radios = within(group).getAllByRole('menuitemradio');

    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    await user.click(screen.getByRole('menuitemradio', { name: 'Pivot point' }));

    expect(handlers.pivot).toHaveBeenCalledExactlyOnceWith('pivot');
  });

  it('blocks tooltips while it is open', async () => {
    await openWithClick();

    expect(screen.getByRole('menu').hasAttribute(POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE)).toBe(true);
  });
});

describe('Menu submenus', () => {
  it('opens a submenu with Right and closes it with Left', async () => {
    const { user } = await openWithClick();

    await user.keyboard('{End}{ArrowUp}{ArrowRight}');
    const submenu = screen.getByRole('menu', { name: 'Create' });

    expect(item('Create').getAttribute('aria-haspopup')).toBe('menu');
    await waitFor(() => {
      expect(focused()).toBe(within(submenu).getByRole('menuitem', { name: 'Cube' }));
    });

    await user.keyboard('{ArrowLeft}');

    expect(screen.queryByRole('menu', { name: 'Create' })).toBeNull();
    expect(focused()).toBe(item('Create'));
  });

  it('closes only the submenu with Esc', async () => {
    const { user } = await openWithClick();

    await user.keyboard('{End}{ArrowUp}{ArrowRight}');
    await expectFocusOn('Cube');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu', { name: 'Create' })).toBeNull();
    expect(screen.getByRole('menu', { name: TRIGGER_LABEL })).toBeDefined();
    expect(focused()).toBe(item('Create'));
  });

  it('opens a submenu on hover', async () => {
    const { user } = await openWithClick();

    await user.hover(item('Create'));

    expect(await screen.findByRole('menu', { name: 'Create' })).toBeDefined();
  });

  it('closes a submenu when a sibling submenu opens', async () => {
    const { user } = await openWithClick();

    await user.hover(item('Create'));
    expect(await screen.findByRole('menu', { name: 'Create' })).toBeDefined();
    await user.hover(item('Align'));

    expect(await screen.findByRole('menu', { name: 'Align' })).toBeDefined();
    expect(screen.queryByRole('menu', { name: 'Create' })).toBeNull();
  });

  it('closes a submenu opened by hover when a sibling opens from the keyboard', async () => {
    const { user } = await openWithClick();

    await user.hover(item('Create'));
    expect(await screen.findByRole('menu', { name: 'Create' })).toBeDefined();
    item('Create').focus();
    await user.keyboard('{ArrowDown}{ArrowRight}');

    expect(await screen.findByRole('menu', { name: 'Align' })).toBeDefined();
    expect(screen.queryByRole('menu', { name: 'Create' })).toBeNull();
  });

  it('closes the whole menu after an item of a submenu is chosen', async () => {
    const { user, handlers } = await openWithClick();

    await user.keyboard('{End}{ArrowUp}{ArrowRight}');
    await expectFocusOn('Cube');
    await user.keyboard('{Enter}');

    expect(handlers.cube).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(trigger());
  });
});

describe('Menu navigation out of the top level', () => {
  it('reports Left and Right on items without a submenu', async () => {
    const user = userEvent.setup();
    const onNavigateOut = vi.fn();
    render(<TriggerHarness handlers={createHandlers()} onNavigateOut={onNavigateOut} />);
    await user.click(trigger());
    await expectFocusOn('Undo');

    await user.keyboard('{ArrowLeft}');
    await user.keyboard('{ArrowRight}');

    expect(onNavigateOut.mock.calls).toEqual([['previous'], ['next']]);
  });

  it('opens a submenu with Right instead of reporting it and ignores keys from the submenu', async () => {
    const user = userEvent.setup();
    const onNavigateOut = vi.fn();
    render(<TriggerHarness handlers={createHandlers()} onNavigateOut={onNavigateOut} />);
    await user.click(trigger());
    await expectFocusOn('Undo');

    await user.keyboard('{End}{ArrowUp}{ArrowRight}');
    await expectFocusOn('Cube');
    await user.keyboard('{ArrowRight}{ArrowLeft}');

    expect(onNavigateOut).not.toHaveBeenCalled();
  });
});

describe('Menu with a controlled state', () => {
  function ControlledHarness({ onOpenChange }: { readonly onOpenChange: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Menu
          items={createItems(createHandlers())}
          open={open}
          onOpenChange={onOpenChange}
          trigger={(triggerProps) => <Button {...triggerProps}>{TRIGGER_LABEL}</Button>}
        />
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          {OUTSIDE}
        </Button>
      </>
    );
  }

  it('follows the open prop and only reports requested changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ControlledHarness onOpenChange={onOpenChange} />);

    expect(screen.getByRole('menu')).toBeDefined();
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('closes when the owner changes the open prop', async () => {
    const user = userEvent.setup();
    render(<ControlledHarness onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('Menu at a point', () => {
  function PointHarness({ onClose }: { readonly onClose: () => void }) {
    const [point, setPoint] = useState<MenuPoint | null>(null);

    return (
      <>
        <Button
          onClick={() => {
            setPoint(POINT);
          }}
        >
          {OUTSIDE}
        </Button>
        <Menu
          label={MENU_LABEL}
          items={createItems(createHandlers())}
          point={point}
          onClose={() => {
            setPoint(null);
            onClose();
          }}
        />
      </>
    );
  }

  it('opens at a point with the focus on the first item and closes with Esc', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PointHarness onClose={onClose} />);

    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(screen.getByRole('menu', { name: MENU_LABEL })).toBeDefined();
    await expectFocusOn('Undo');

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(focused()).toBe(screen.getByRole('button', { name: OUTSIDE }));
  });

  it('closes after an item is chosen', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PointHarness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: OUTSIDE }));
    await expectFocusOn('Undo');

    await user.keyboard('{Enter}');

    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('Menu in a toolbar', () => {
  it('keeps the arrows of the menu inside it and the roving focus of the toolbar intact', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={MENU_LABEL}>
        <Menu
          items={createItems(createHandlers())}
          trigger={(triggerProps) => (
            <IconButton {...triggerProps} label={TRIGGER_LABEL} icon={frameworkIcons.plus} />
          )}
        />
        <IconButton label={NEXT_TOOL} icon={frameworkIcons.search} />
      </Toolbar>,
    );

    await user.tab();
    await user.keyboard('{Enter}');
    await expectFocusOn('Undo');
    await user.keyboard('{ArrowDown}{ArrowRight}{ArrowLeft}');
    expect(focused()).toBe(item('Duplicate'));

    await user.keyboard('{Escape}');
    expect(focused()).toBe(trigger());
    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe(screen.getByRole('button', { name: NEXT_TOOL }));
  });
});
