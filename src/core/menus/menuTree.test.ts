import { describe, expect, it } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { buildMenuTree, commandBinding, isValidMenuPath, parentMenuPath } from './menuTree';
import type { MenuEntry, MenuNodeGroup } from './menuTree';

const messages = defineMessages({
  en: { label: 'Label' },
  ru: { label: 'Подпись' },
});

const LABEL = messageRef(messages, 'label');

function submenu(path: string, group: number, order: number): MenuEntry<undefined> {
  return { kind: 'submenu', path, label: LABEL, group, order };
}

function item(path: string, group: number, order: number): MenuEntry<undefined> {
  const command = defineCommand({ id: path, label: LABEL });

  return { kind: 'command', path, group, order, binding: commandBinding(command) };
}

function paths(groups: readonly MenuNodeGroup<undefined>[]): string[][] {
  return groups.map((group) => group.map((node) => node.path));
}

describe('parentMenuPath', () => {
  it.each([
    ['file', ''],
    ['file/save', 'file'],
    ['file/export/png', 'file/export'],
  ])('finds the parent of %s', (path, parent) => {
    expect(parentMenuPath(path)).toBe(parent);
  });
});

describe('isValidMenuPath', () => {
  it.each(['file', 'file/save', 'game-object/3d/cube'])('accepts %s', (path) => {
    expect(isValidMenuPath(path)).toBe(true);
  });

  it.each(['', '/file', 'file/', 'file//save', 'file/save as'])('rejects %j', (path) => {
    expect(isValidMenuPath(path)).toBe(false);
  });
});

describe('buildMenuTree', () => {
  it('sorts by group, then by order, then by registration', () => {
    const tree = buildMenuTree([
      submenu('edit', 0, 20),
      submenu('help', 9, 0),
      submenu('file', 0, 10),
      submenu('window', 5, 0),
      submenu('tools', 5, 0),
    ]);

    expect(paths(tree)).toEqual([['file', 'edit'], ['window', 'tools'], ['help']]);
  });

  it('nests entries under their submenus with their own groups', () => {
    const tree = buildMenuTree([
      item('file/quit', 9, 0),
      submenu('file', 0, 0),
      item('file/save', 1, 10),
      item('file/open', 0, 0),
      item('file/saveAs', 1, 20),
    ]);
    const file = tree[0]?.[0];

    expect(file?.kind).toBe('submenu');
    expect(file?.kind === 'submenu' ? paths(file.groups) : []).toEqual([
      ['file/open'],
      ['file/save', 'file/saveAs'],
      ['file/quit'],
    ]);
  });

  it('skips entries whose parent is not registered', () => {
    expect(paths(buildMenuTree([submenu('file', 0, 0), item('edit/undo', 0, 0)]))).toEqual([
      ['file'],
    ]);
  });

  it('builds an empty tree from no entries', () => {
    expect(buildMenuTree([])).toEqual([]);
  });
});
