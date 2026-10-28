import { useEffect, useState } from 'react';
import { DockviewReact } from 'dockview-react';
import type { DockviewApi, DockviewReadyEvent, DockviewTheme } from 'dockview-react';
import 'dockview-react/dist/styles/dockview.css';
import { useMessages } from '@/state/language/useMessages';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { classNames } from '@/ui/classNames';
import { WINDOW_PANEL_COMPONENT, createDockviewAdapter } from './dockviewAdapter';
import styles from './DockLayout.module.css';
import { layoutMessages } from './layoutMessages';
import { WindowPanel } from './WindowPanel';
import { WindowTab } from './WindowTab';

interface DockLayoutProps {
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

export function DockLayout({ className }: DockLayoutProps) {
  const { workspace } = useEditorRegistries();
  const [api, setApi] = useState<DockviewApi | null>(null);

  useEffect(() => {
    if (api === null) {
      return undefined;
    }

    return workspace.attach(createDockviewAdapter(api));
  }, [api, workspace]);

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
