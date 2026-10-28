import { useSyncExternalStore } from 'react';
import type { CommandDefinition, CommandInvocation } from '@/core/commands/command';
import type { CommandState } from '@/core/commands/commandRegistry';
import { useEditorRegistries } from './registriesContext';

export function useCommandState<TTarget>(
  command: CommandDefinition<TTarget>,
  invocation: CommandInvocation<TTarget>,
): CommandState {
  const { commands } = useEditorRegistries();

  useSyncExternalStore(commands.subscribe, commands.getVersion);

  return commands.getState(command, invocation);
}
