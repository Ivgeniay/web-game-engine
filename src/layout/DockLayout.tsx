import { useEffect, useState } from 'react';
import { DockviewReact } from 'dockview-react';
import type { DockviewApi, DockviewReadyEvent, DockviewTheme } from 'dockview-react';
import 'dockview-react/dist/styles/dockview.css';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useMessages } from '@/state/language/useMessages';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useRegistration } from '@/state/registries/useRegistration';
import { classNames } from '@/ui/classNames';
import { createDockviewAdapter } from './dockviewAdapter';
import styles from './DockLayout.module.css';
import { registerLayoutCommands } from './layoutCommands';
import { layoutMessages } from './layoutMessages';
import { restoreLayout, startLayoutSaving } from './layoutPersistence';
import type { LayoutStorage } from './layoutPersistence';
import { WindowPanel } from './WindowPanel';
import { WINDOW_PANEL_COMPONENT } from './windowPanelParams';
import { WindowTab } from './WindowTab';

interface DockLayoutProps {
  readonly layoutStorage?: LayoutStorage | undefined;
  readonly className?: string | undefined;
}

const EDITOR_DOCK_THEME: DockviewTheme = {
  name: 'editor',
  className: styles.theme ?? '',
  gap: 0,
  dndTabIndicator: 'line',
};

const PANEL_COMPONENTS = { [WINDOW_PANEL_COMPONENT]: WindowPanel };

function EmptyWorkspace() {
  const messages = useMessages(layoutMessages);

  return <p className={styles.empty}>{messages('noOpenWindows')}</p>;
}

export function DockLayout({ layoutStorage, className }: DockLayoutProps) {
  const { windows, workspace } = useEditorRegistries();
  const [api, setApi] = useState<DockviewApi | null>(null);

  useRegistration(registerLayoutCommands, []);

  useEffect(() => {
    if (api === null) {
      return undefined;
    }

    restoreLayout({
      api,
      stored: layoutStorage?.load() ?? null,
      defaultLayout: workspace.getDefaultLayout(),
      isKnownWindowType: (windowType) => windows.get(windowType) !== undefined,
    });
    const detach = workspace.attach(createDockviewAdapter(api));

    if (layoutStorage === undefined) {
      return detach;
    }

    return combineUnsubscribes(
      detach,
      startLayoutSaving({ api, storage: layoutStorage, pageLifecycle: window }),
    );
  }, [api, windows, workspace, layoutStorage]);

  function handleReady(event: DockviewReadyEvent): void {
    setApi(event.api);
  }

  return (
    <div className={classNames(styles.root, className)}>
      <DockviewReact
        theme={EDITOR_DOCK_THEME}
        components={PANEL_COMPONENTS}
        defaultTabComponent={WindowTab}
        watermarkComponent={EmptyWorkspace}
        disableFloatingGroups
        announcements={false}
        onReady={handleReady}
      />
    </div>
  );
}
