import type { CommandDefinitionBase } from '@/core/commands/command';
import { reportDevelopmentError } from '@/core/developmentError';
import { isReservedShortcut } from './reservedShortcuts';
import { parseShortcutKeys } from './shortcut';
import type { ParsedShortcut, ShortcutKeys } from './shortcut';

export const GLOBAL_HOTKEY_SCOPE = 'global';

export interface KeyBinding {
  readonly command: CommandDefinitionBase;
  readonly keys: ShortcutKeys;
  readonly shortcut: ParsedShortcut;
  readonly scope: string;
  readonly allowInTextInput: boolean;
}

export type Keymap = ReadonlyMap<string, readonly KeyBinding[]>;

function bindingOf(command: CommandDefinitionBase): KeyBinding | null {
  const { shortcut } = command;

  if (shortcut === undefined) {
    return null;
  }

  return {
    command,
    keys: shortcut.keys,
    shortcut: parseShortcutKeys(shortcut.keys),
    scope: shortcut.scope ?? GLOBAL_HOTKEY_SCOPE,
    allowInTextInput: shortcut.allowInTextInput ?? false,
  };
}

function acceptsBinding(binding: KeyBinding, scopeBindings: readonly KeyBinding[]): boolean {
  if (isReservedShortcut(binding.keys)) {
    reportDevelopmentError(
      `Shortcut ${binding.keys} of command "${binding.command.id}" is reserved by the browser or the operating system.`,
    );
    return false;
  }

  const conflict = scopeBindings.find(({ keys }) => keys === binding.keys);

  if (conflict !== undefined) {
    reportDevelopmentError(
      `Shortcut ${binding.keys} in scope "${binding.scope}" is assigned to both "${conflict.command.id}" and "${binding.command.id}".`,
    );
    return false;
  }

  return true;
}

export function createKeymap(commands: readonly CommandDefinitionBase[]): Keymap {
  const keymap = new Map<string, KeyBinding[]>();

  for (const command of commands) {
    const binding = bindingOf(command);

    if (binding === null) {
      continue;
    }

    const scopeBindings = keymap.get(binding.scope) ?? [];

    if (acceptsBinding(binding, scopeBindings)) {
      keymap.set(binding.scope, [...scopeBindings, binding]);
    }
  }

  return keymap;
}
