import { createCommandRegistry } from '@/core/commands/commandRegistry';
import type { CommandRegistry } from '@/core/commands/commandRegistry';

export interface EditorRegistries {
  readonly commands: CommandRegistry;
}

export function createEditorRegistries(): EditorRegistries {
  return {
    commands: createCommandRegistry(),
  };
}
