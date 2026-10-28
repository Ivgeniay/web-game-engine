import type { CommandSource } from '@/core/commands/command';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import type { MenuCommandNode, MenuNode, MenuNodeGroup } from '@/core/menus/menuTree';
import type { RefTranslator } from '@/state/language/useTranslate';
import type { ShortcutFormatter } from '@/state/platform/useFormatShortcut';
import type { MenuItem } from '@/ui/menu/menuItems';

export interface MenuBuildContext<TTarget> {
  readonly commands: CommandRegistry;
  readonly source: CommandSource;
  readonly target: TTarget;
  readonly translate: RefTranslator;
  readonly formatShortcut: ShortcutFormatter;
}

const RUN_AFTER_MENU_CLOSE_DELAY_MS = 0;

export function runAfterMenuCloses(action: () => void): void {
  setTimeout(action, RUN_AFTER_MENU_CLOSE_DELAY_MS);
}

function isVisible<TTarget>(node: MenuNode<TTarget>, commands: CommandRegistry): boolean {
  return node.kind === 'command'
    ? commands.isHandled(node.binding.command)
    : hasVisibleItems(node.groups, commands);
}

export function hasVisibleItems<TTarget>(
  groups: readonly MenuNodeGroup<TTarget>[],
  commands: CommandRegistry,
): boolean {
  return groups.some((group) => group.some((node) => isVisible(node, commands)));
}

function commandItem<TTarget>(
  { path, binding }: MenuCommandNode<TTarget>,
  context: MenuBuildContext<TTarget>,
): MenuItem {
  const { commands, source, target, translate, formatShortcut } = context;
  const { command } = binding;
  const state = binding.getState(commands, source, target);
  const label = translate(command.label);
  const shortcut =
    command.shortcut === undefined ? undefined : formatShortcut(command.shortcut.keys);

  function execute(): void {
    runAfterMenuCloses(() => {
      binding.execute(commands, source, target);
    });
  }

  if (state.checked !== undefined) {
    return {
      kind: 'checkbox',
      id: path,
      label,
      shortcut,
      disabled: !state.enabled,
      checked: state.checked,
      onCheckedChange: execute,
    };
  }

  return {
    kind: 'action',
    id: path,
    label,
    icon: command.icon,
    shortcut,
    disabled: !state.enabled,
    onSelect: execute,
  };
}

function itemOf<TTarget>(
  node: MenuNode<TTarget>,
  context: MenuBuildContext<TTarget>,
): MenuItem | null {
  if (!isVisible(node, context.commands)) {
    return null;
  }

  if (node.kind === 'command') {
    return commandItem(node, context);
  }

  return {
    kind: 'submenu',
    id: node.path,
    label: context.translate(node.label),
    icon: node.icon,
    items: menuItemsFromTree(node.groups, context),
  };
}

export function menuItemsFromTree<TTarget>(
  groups: readonly MenuNodeGroup<TTarget>[],
  context: MenuBuildContext<TTarget>,
): MenuItem[] {
  const visibleGroups = groups
    .map((group) => group.flatMap((node) => itemOf(node, context) ?? []))
    .filter((items) => items.length > 0);

  return visibleGroups.flatMap((items, index) =>
    index === 0 ? items : [{ kind: 'separator', id: `separator-${String(index)}` }, ...items],
  );
}
