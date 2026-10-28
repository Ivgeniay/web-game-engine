import { defineCommand } from '@/core/commands/command';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { demoIcons } from '@/demo/demoIcons';
import { demoMessages } from '@/demo/demoMessages';
import { PlayModeStatus } from './PlayModeStatus';
import type { PlayModeStore } from './playModeStore';

export const playCommand = defineCommand({
  id: 'playMode.play',
  label: messageRef(demoMessages, 'play'),
  icon: demoIcons.play,
  shortcut: { keys: 'Mod+KeyP' },
});

export const pauseCommand = defineCommand({
  id: 'playMode.pause',
  label: messageRef(demoMessages, 'pause'),
  icon: demoIcons.pause,
  shortcut: { keys: 'Mod+Alt+KeyP' },
});

export const stepCommand = defineCommand({
  id: 'playMode.step',
  label: messageRef(demoMessages, 'step'),
  icon: demoIcons.step,
  shortcut: { keys: 'Mod+Alt+Shift+KeyP' },
});

const PLAY_MODE_GROUP = 0;
const EDIT_MENU_PLAY_MODE_GROUP = 10;
const STATUS_ORDER = 0;

export function registerPlayMode(
  { commands, mainMenu, statusBar, toolbar }: EditorRegistries,
  store: PlayModeStore,
): Unsubscribe {
  const state = () => store.getState();

  return combineUnsubscribes(
    commands.handle(playCommand, {
      run: () => {
        state().togglePlay();
      },
      isChecked: () => state().mode !== 'edit',
    }),
    commands.handle(pauseCommand, {
      run: () => {
        state().togglePause();
      },
      isEnabled: () => state().mode !== 'edit',
      isChecked: () => state().mode === 'paused',
    }),
    commands.handle(stepCommand, {
      run: () => {
        state().step();
      },
      isEnabled: () => state().mode === 'paused',
    }),
    store.subscribe(commands.refresh),
    ...[playCommand, pauseCommand, stepCommand].flatMap((command, order) => [
      toolbar.register({
        kind: 'command',
        id: command.id,
        zone: 'center',
        group: PLAY_MODE_GROUP,
        order,
        command,
      }),
      mainMenu.registerItem({
        path: `edit/${command.id}`,
        command,
        group: EDIT_MENU_PLAY_MODE_GROUP,
        order,
      }),
    ]),
    statusBar.register({
      id: 'playMode.status',
      zone: 'left',
      order: STATUS_ORDER,
      component: PlayModeStatus,
      announce: true,
    }),
  );
}
