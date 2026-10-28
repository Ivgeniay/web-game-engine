import type {
  CommandDefinition,
  CommandDefinitionBase,
  CommandSource,
} from '@/core/commands/command';
import type { CommandRegistry, CommandState } from '@/core/commands/commandRegistry';
import type { MessageRef } from '@/core/i18n/translate';
import type { IconSource } from '@/icons/icon';

export const MENU_PATH_SEPARATOR = '/';

export const MENU_ROOT_PATH = '';

export interface MenuPlacement {
  readonly group: number;
  readonly order: number;
}

export interface MenuCommandBinding<TTarget> {
  readonly command: CommandDefinitionBase;
  getState(commands: CommandRegistry, source: CommandSource, target: TTarget): CommandState;
  execute(commands: CommandRegistry, source: CommandSource, target: TTarget): boolean;
}

export interface MenuSubmenuRegistration extends MenuPlacement {
  readonly path: string;
  readonly label: MessageRef;
  readonly icon?: IconSource | undefined;
}

export interface MenuSubmenuEntry extends MenuSubmenuRegistration {
  readonly kind: 'submenu';
}

export interface MenuCommandEntry<TTarget> extends MenuPlacement {
  readonly kind: 'command';
  readonly path: string;
  readonly binding: MenuCommandBinding<TTarget>;
}

export type MenuEntry<TTarget> = MenuSubmenuEntry | MenuCommandEntry<TTarget>;

export interface MenuSubmenuNode<TTarget> {
  readonly kind: 'submenu';
  readonly path: string;
  readonly label: MessageRef;
  readonly icon: IconSource | undefined;
  readonly groups: readonly MenuNodeGroup<TTarget>[];
}

export interface MenuCommandNode<TTarget> {
  readonly kind: 'command';
  readonly path: string;
  readonly binding: MenuCommandBinding<TTarget>;
}

export type MenuNode<TTarget> = MenuSubmenuNode<TTarget> | MenuCommandNode<TTarget>;

export type MenuNodeGroup<TTarget> = readonly MenuNode<TTarget>[];

const MENU_PATH_PATTERN = /^[^/\s]+(\/[^/\s]+)*$/;

export function isValidMenuPath(path: string): boolean {
  return MENU_PATH_PATTERN.test(path);
}

export function parentMenuPath(path: string): string {
  const separatorIndex = path.lastIndexOf(MENU_PATH_SEPARATOR);

  return separatorIndex === -1 ? MENU_ROOT_PATH : path.slice(0, separatorIndex);
}

export function commandBinding<TTarget>(
  command: CommandDefinition<TTarget>,
): MenuCommandBinding<TTarget> {
  return {
    command,
    getState: (commands, source, target) => commands.getState(command, { source, target }),
    execute: (commands, source, target) => commands.execute(command, { source, target }),
  };
}

export function targetlessCommandBinding<TTarget>(
  command: CommandDefinition,
): MenuCommandBinding<TTarget> {
  return {
    command,
    getState: (commands, source) => commands.getState(command, { source, target: undefined }),
    execute: (commands, source) => commands.execute(command, { source, target: undefined }),
  };
}

function comparePlacement(first: MenuPlacement, second: MenuPlacement): number {
  return first.group - second.group || first.order - second.order;
}

function nodeOf<TTarget>(
  entry: MenuEntry<TTarget>,
  childrenByParent: ReadonlyMap<string, readonly MenuEntry<TTarget>[]>,
): MenuNode<TTarget> {
  if (entry.kind === 'command') {
    return { kind: 'command', path: entry.path, binding: entry.binding };
  }

  return {
    kind: 'submenu',
    path: entry.path,
    label: entry.label,
    icon: entry.icon,
    groups: groupsOf(entry.path, childrenByParent),
  };
}

function groupsOf<TTarget>(
  parent: string,
  childrenByParent: ReadonlyMap<string, readonly MenuEntry<TTarget>[]>,
): MenuNodeGroup<TTarget>[] {
  const children = [...(childrenByParent.get(parent) ?? [])].sort(comparePlacement);
  const groups: MenuNode<TTarget>[][] = [];
  let currentGroup: number | null = null;

  for (const child of children) {
    if (child.group !== currentGroup) {
      groups.push([]);
      currentGroup = child.group;
    }

    groups.at(-1)?.push(nodeOf(child, childrenByParent));
  }

  return groups;
}

export function buildMenuTree<TTarget>(
  entries: readonly MenuEntry<TTarget>[],
): readonly MenuNodeGroup<TTarget>[] {
  const childrenByParent = new Map<string, MenuEntry<TTarget>[]>();

  for (const entry of entries) {
    const parent = parentMenuPath(entry.path);
    childrenByParent.set(parent, [...(childrenByParent.get(parent) ?? []), entry]);
  }

  return groupsOf(MENU_ROOT_PATH, childrenByParent);
}
