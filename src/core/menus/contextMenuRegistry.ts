import type { CommandDefinition } from '@/core/commands/command';
import { reportDevelopmentError } from '@/core/developmentError';
import type { MessageRef } from '@/core/i18n/translate';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';
import { commandBinding, isValidMenuPath, targetlessCommandBinding } from './menuTree';
import type { MenuEntry, MenuPlacement, MenuSubmenuRegistration } from './menuTree';

declare const contextTarget: unique symbol;

export interface ContextMenuContextInput {
  readonly id: string;
  readonly label: MessageRef;
}

export interface ContextMenuContext<TTarget> extends ContextMenuContextInput {
  readonly [contextTarget]?: TTarget;
}

export function defineContextMenu<TTarget>(
  context: ContextMenuContextInput,
): ContextMenuContext<TTarget> {
  return context;
}

interface TargetCommandItemRegistration<TTarget> extends MenuPlacement {
  readonly path: string;
  readonly command: CommandDefinition<TTarget>;
  readonly withoutTarget?: never;
}

interface TargetlessCommandItemRegistration extends MenuPlacement {
  readonly path: string;
  readonly command: CommandDefinition;
  readonly withoutTarget: true;
}

export type ContextMenuItemRegistration<TTarget> =
  TargetCommandItemRegistration<TTarget> | TargetlessCommandItemRegistration;

interface ContextMenuEntry {
  readonly contextId: string;
  readonly entry: MenuEntry<unknown>;
}

export interface ContextMenuRegistry {
  readonly registerMenu: <TTarget>(
    context: ContextMenuContext<TTarget>,
    menu: MenuSubmenuRegistration,
  ) => Unsubscribe;
  readonly registerItem: <TTarget>(
    context: ContextMenuContext<TTarget>,
    item: ContextMenuItemRegistration<TTarget>,
  ) => Unsubscribe;
  readonly getEntries: <TTarget>(
    context: ContextMenuContext<TTarget>,
  ) => readonly MenuEntry<TTarget>[];
  readonly getVersion: () => number;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

const ENTRY_ID_SEPARATOR = '::';

function ignoreUnsubscribe(): void {}

export function createContextMenuRegistry(): ContextMenuRegistry {
  const entries = createRegistry<ContextMenuEntry>({
    kind: 'context menu path',
    getId: ({ contextId, entry }) => `${contextId}${ENTRY_ID_SEPARATOR}${entry.path}`,
  });
  let version = 0;

  entries.subscribe(() => {
    version += 1;
  });

  function register(contextId: string, entry: MenuEntry<unknown>): Unsubscribe {
    if (!isValidMenuPath(entry.path)) {
      reportDevelopmentError(`Invalid context menu path "${entry.path}" in "${contextId}".`);
      return ignoreUnsubscribe;
    }

    return entries.register({ contextId, entry });
  }

  return {
    registerMenu: (context, menu) => register(context.id, { ...menu, kind: 'submenu' }),
    registerItem(context, item) {
      const { path, group, order } = item;
      const binding =
        item.withoutTarget === true
          ? targetlessCommandBinding(item.command)
          : commandBinding(item.command);

      return register(context.id, { kind: 'command', path, group, order, binding });
    },
    getEntries: (context) =>
      entries
        .getSnapshot()
        .filter(({ contextId }) => contextId === context.id)
        .map(({ entry }) => entry),
    getVersion: () => version,
    subscribe: entries.subscribe,
  };
}
