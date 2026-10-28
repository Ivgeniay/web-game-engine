import { defineCommand } from '@/core/commands/command';
import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { layoutMessages } from './layoutMessages';

export const resetLayoutCommand = defineCommand({
  id: 'layout.reset',
  label: messageRef(layoutMessages, 'resetLayout'),
  icon: frameworkIcons.reset,
});

export const toggleMaximizeCommand = defineCommand({
  id: 'layout.toggleMaximize',
  label: messageRef(layoutMessages, 'maximize'),
  icon: frameworkIcons.maximize,
});

export function registerLayoutCommands({
  commands,
  workspace,
  dialogs,
}: EditorRegistries): Unsubscribe {
  return combineUnsubscribes(
    commands.handle(resetLayoutCommand, {
      async run() {
        const answer = await dialogs.confirm({
          title: messageRef(layoutMessages, 'resetLayoutTitle'),
          message: messageRef(layoutMessages, 'resetLayoutMessage'),
          confirmLabel: messageRef(commonMessages, 'reset'),
          destructive: true,
        });

        if (answer === 'confirm') {
          workspace.resetLayout();
        }
      },
      isEnabled: () => workspace.isAttached() && workspace.getDefaultLayout() !== null,
    }),
    commands.handle(toggleMaximizeCommand, {
      run() {
        if (workspace.isMaximized()) {
          workspace.restore();
          return;
        }

        const activeWindow = workspace.getActiveWindow();

        if (activeWindow !== null) {
          workspace.maximize(activeWindow.id);
        }
      },
      isEnabled: () => workspace.isMaximized() || workspace.getActiveWindow() !== null,
      isChecked: () => workspace.isMaximized(),
    }),
    workspace.subscribe(commands.refresh),
  );
}
