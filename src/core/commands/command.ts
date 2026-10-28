import type { MessageRef } from '@/core/i18n/translate';
import type { CommandShortcut } from '@/core/hotkeys/shortcut';
import type { IconSource } from '@/icons/icon';

export const COMMAND_SOURCES = ['menu', 'context-menu', 'toolbar', 'hotkey', 'code'] as const;

export type CommandSource = (typeof COMMAND_SOURCES)[number];

export interface CommandInvocation<TTarget> {
  readonly source: CommandSource;
  readonly target: TTarget;
}

export interface CommandHandler<TTarget> {
  run(invocation: CommandInvocation<TTarget>): void | Promise<void>;
  isEnabled?(invocation: CommandInvocation<TTarget>): boolean;
  isChecked?(invocation: CommandInvocation<TTarget>): boolean;
}

export interface CommandDefinitionBase {
  readonly id: string;
  readonly label: MessageRef;
  readonly icon?: IconSource | undefined;
  readonly shortcut?: CommandShortcut | undefined;
}

export type ShortcutFor<TTarget> = [TTarget] extends [undefined] ? CommandShortcut : never;

declare const commandTarget: unique symbol;

export interface CommandDefinition<TTarget = undefined> extends CommandDefinitionBase {
  readonly shortcut?: ShortcutFor<TTarget> | undefined;
  readonly [commandTarget]?: TTarget;
}

export interface CommandDefinitionInput<TTarget> extends CommandDefinitionBase {
  readonly shortcut?: ShortcutFor<TTarget> | undefined;
}

export function defineCommand<TTarget = undefined>(
  definition: CommandDefinitionInput<TTarget>,
): CommandDefinition<TTarget> {
  return definition;
}
