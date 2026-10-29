import type { EditorExtension } from '@/state/registries/editorExtension';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { unityLayout } from './defaultLayout';
import { registerDemoMenus } from './demoMenus';
import type { DemoStores } from './demoStores';
import { registerPlayMode } from '@/demo/playMode/playModeCommands';
import { registerSceneCommands } from '@/demo/scene/sceneCommands';
import { registerDemoWindows } from '@/demo/windows/demoWindows';

export function installDemo(stores: DemoStores): EditorExtension {
  return (editor) =>
    combineUnsubscribes(
      registerDemoWindows(editor),
      editor.workspace.setDefaultLayout(unityLayout),
      registerDemoMenus(editor),
      registerPlayMode(editor, stores.playMode),
      registerSceneCommands(editor, stores.scene),
    );
}
