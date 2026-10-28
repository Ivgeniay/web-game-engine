import { useEffect, useSyncExternalStore } from 'react';
import type { IDockviewPanelProps } from 'dockview-react';
import { useMessages } from '@/state/language/useMessages';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { WindowFrame } from '@/windows/WindowFrame';
import { windowTypeOfParams } from './dockviewAdapter';
import { layoutMessages } from './layoutMessages';
import styles from './WindowPanel.module.css';

export function WindowPanel({ api, params }: IDockviewPanelProps) {
  const { windows, workspace } = useEditorRegistries();
  const messages = useMessages(layoutMessages);
  const windowTypeId = windowTypeOfParams(params) ?? api.id;
  const windowType = useSyncExternalStore(windows.subscribe, () => windows.get(windowTypeId));

  useEffect(() => {
    const subscription = api.onDidActiveChange(({ isActive }) => {
      if (isActive) {
        workspace.requestFocus(api.id);
      }
    });

    return () => {
      subscription.dispose();
    };
  }, [api, workspace]);

  function activate(): void {
    if (!api.isActive) {
      api.setActive();
    }
  }

  const Content = windowType?.component;

  return (
    <WindowFrame windowId={api.id} windowType={windowTypeId} onActivate={activate}>
      {Content === undefined ? (
        <p className={styles.unavailable}>{messages('windowUnavailable')}</p>
      ) : (
        <Content windowId={api.id} />
      )}
    </WindowFrame>
  );
}
