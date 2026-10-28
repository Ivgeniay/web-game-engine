import { describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createToolbarRegistry, toolbarZoneGroups } from './toolbarRegistry';
import type { ToolbarItem, ToolbarZone } from './toolbarRegistry';

const messages = defineMessages({
  en: { play: 'Play' },
  ru: { play: 'Запустить' },
});

const play = defineCommand({ id: 'game.play', label: messageRef(messages, 'play') });

function Resolution() {
  return null;
}

function item(id: string, zone: ToolbarZone, group: number, order: number): ToolbarItem {
  return { kind: 'command', id, zone, group, order, command: play };
}

describe('createToolbarRegistry', () => {
  it('keeps commands and components in registration order', () => {
    const registry = createToolbarRegistry();
    const component: ToolbarItem = {
      kind: 'component',
      id: 'game.resolution',
      zone: 'right',
      group: 0,
      order: 0,
      component: Resolution,
    };

    registry.register(item('game.play', 'center', 0, 0));
    registry.register(component);

    expect(registry.getItems().map(({ id }) => id)).toEqual(['game.play', 'game.resolution']);
  });

  it('removes an item and notifies subscribers', () => {
    const registry = createToolbarRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    registry.register(item('game.play', 'center', 0, 0))();

    expect(registry.getItems()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('throws on a duplicate id in development', () => {
    const registry = createToolbarRegistry();
    registry.register(item('game.play', 'center', 0, 0));

    expect(() => registry.register(item('game.play', 'left', 0, 0))).toThrow(
      'Duplicate toolbar item id "game.play".',
    );
  });
});

describe('toolbarZoneGroups', () => {
  it('takes the items of one zone, sorted by group and order and split into groups', () => {
    const items = [
      item('step', 'center', 0, 20),
      item('tools', 'left', 0, 0),
      item('play', 'center', 0, 0),
      item('pause', 'center', 0, 10),
      item('maximize', 'center', 10, 0),
    ];

    expect(toolbarZoneGroups(items, 'center').map((group) => group.map(({ id }) => id))).toEqual([
      ['play', 'pause', 'step'],
      ['maximize'],
    ]);
    expect(toolbarZoneGroups(items, 'right')).toEqual([]);
  });
});
