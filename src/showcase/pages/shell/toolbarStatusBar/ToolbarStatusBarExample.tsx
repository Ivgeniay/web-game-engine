import { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/state/registries/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { MainToolbar } from '@/shell/MainToolbar';
import { MenuBar } from '@/shell/MenuBar';
import { StatusBar } from '@/shell/StatusBar';
import { useMessages } from '@/state/language/useMessages';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { Label } from '@/ui/label/Label';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import styles from './ToolbarStatusBarExample.module.css';

const gameMessages = defineMessages({
  en: {
    game: 'Game',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    resolution: 'Game view resolution',
    freeAspect: 'Free aspect',
    scene: 'Scene: Main level',
    stopped: 'Stopped',
    playing: 'Playing',
    paused: 'Paused',
  },
  ru: {
    game: 'Игра',
    play: 'Запустить',
    pause: 'Пауза',
    step: 'Шаг',
    resolution: 'Разрешение окна Game',
    freeAspect: 'Любое соотношение',
    scene: 'Сцена: Main level',
    stopped: 'Остановлено',
    playing: 'Идёт игра',
    paused: 'На паузе',
  },
});

type Resolution = '1920x1080' | '1280x720' | 'free';

const FULL_HD_LABEL = '1920×1080';
const HD_LABEL = '1280×720';

interface GameState {
  readonly playing: boolean;
  readonly paused: boolean;
  readonly resolution: Resolution;
}

interface MockGameEngine {
  readonly getState: () => GameState;
  readonly update: (change: Partial<GameState>) => void;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

function createMockGameEngine(): MockGameEngine {
  let state: GameState = { playing: false, paused: false, resolution: 'free' };
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    update(change) {
      state = { ...state, ...change };
      listeners.forEach((listener) => {
        listener();
      });
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

const GameEngineContext = createContext<MockGameEngine | null>(null);

function useGameState(): GameState {
  const engine = useContext(GameEngineContext);

  if (engine === null) {
    throw new Error('The game engine is not provided.');
  }

  return useSyncExternalStore(engine.subscribe, engine.getState);
}

const play = defineCommand({
  id: 'game.play',
  label: messageRef(gameMessages, 'play'),
  shortcut: { keys: 'Mod+KeyP' },
});
const pause = defineCommand({ id: 'game.pause', label: messageRef(gameMessages, 'pause') });
const step = defineCommand({ id: 'game.step', label: messageRef(gameMessages, 'step') });

function ResolutionSelect() {
  const t = useMessages(gameMessages);
  const engine = useContext(GameEngineContext);
  const { resolution } = useGameState();
  const options: readonly SelectEntry<Resolution>[] = [
    { kind: 'option', value: 'free', label: t('freeAspect') },
    { kind: 'option', value: '1920x1080', label: FULL_HD_LABEL },
    { kind: 'option', value: '1280x720', label: HD_LABEL },
  ];

  return (
    <Select
      aria-label={t('resolution')}
      options={options}
      value={resolution}
      onValueChange={(value) => {
        engine?.update({ resolution: value });
      }}
      variant="flat"
      size="sm"
    />
  );
}

function SceneName() {
  return <Label tone="secondary">{useMessages(gameMessages)('scene')}</Label>;
}

function PlayState() {
  const t = useMessages(gameMessages);
  const { playing, paused } = useGameState();
  const state = playing ? (paused ? 'paused' : 'playing') : 'stopped';

  return <Label tone="secondary">{t(state)}</Label>;
}

function gameExtension(engine: MockGameEngine): EditorExtension {
  return ({ commands, mainMenu, toolbar, statusBar }) =>
    combineUnsubscribes(
      engine.subscribe(commands.refresh),
      commands.handle(play, {
        run: () => {
          engine.update({ playing: !engine.getState().playing, paused: false });
        },
        isChecked: () => engine.getState().playing,
      }),
      commands.handle(pause, {
        run: () => {
          engine.update({ paused: !engine.getState().paused });
        },
        isEnabled: () => engine.getState().playing,
        isChecked: () => engine.getState().paused,
      }),
      commands.handle(step, {
        run: () => undefined,
        isEnabled: () => engine.getState().playing && engine.getState().paused,
      }),
      mainMenu.registerMenu({
        path: 'game',
        label: messageRef(gameMessages, 'game'),
        group: 0,
        order: 0,
      }),
      mainMenu.registerItem({ path: 'game/play', command: play, group: 0, order: 0 }),
      mainMenu.registerItem({ path: 'game/pause', command: pause, group: 0, order: 10 }),
      mainMenu.registerItem({ path: 'game/step', command: step, group: 0, order: 20 }),
      toolbar.register({
        kind: 'command',
        id: 'game.play',
        zone: 'center',
        group: 0,
        order: 0,
        command: play,
      }),
      toolbar.register({
        kind: 'command',
        id: 'game.pause',
        zone: 'center',
        group: 0,
        order: 10,
        command: pause,
      }),
      toolbar.register({
        kind: 'command',
        id: 'game.step',
        zone: 'center',
        group: 0,
        order: 20,
        command: step,
      }),
      toolbar.register({
        kind: 'component',
        id: 'game.resolution',
        zone: 'right',
        group: 0,
        order: 0,
        component: ResolutionSelect,
      }),
      statusBar.register({ id: 'scene.name', zone: 'left', order: 0, component: SceneName }),
      statusBar.register({
        id: 'game.state',
        zone: 'right',
        order: 0,
        component: PlayState,
        announce: true,
      }),
    );
}

export function ToolbarStatusBarExample() {
  const [{ editor, engine }] = useState(() => {
    const registries = createEditorRegistries();
    const gameEngine = createMockGameEngine();
    gameExtension(gameEngine)(registries);

    return { editor: registries, engine: gameEngine };
  });

  return (
    <GameEngineContext value={engine}>
      <RegistriesProvider registries={editor}>
        <div className={styles.root}>
          <MenuBar altKeyActivates={false} />
          <MainToolbar />
          <div className={styles.workspace} />
          <StatusBar />
        </div>
      </RegistriesProvider>
    </GameEngineContext>
  );
}
