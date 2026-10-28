import { useSyncExternalStore } from 'react';
import type { IDockviewPanelHeaderProps } from 'dockview-react';
import { useTranslate } from '@/state/language/useTranslate';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Icon } from '@/ui/icon/Icon';
import { windowTypeOfParams } from './dockviewAdapter';
import styles from './WindowTab.module.css';

export function WindowTab({ api, params }: IDockviewPanelHeaderProps) {
  const { windows, workspace } = useEditorRegistries();
  const translate = useTranslate();
  const windowTypeId = windowTypeOfParams(params) ?? api.id;
  const windowType = useSyncExternalStore(windows.subscribe, () => windows.get(windowTypeId));

  function focusWindow(): void {
    workspace.requestFocus(api.id);
  }

  return (
    <div className={styles.root} onClick={focusWindow}>
      {windowType?.icon === undefined ? null : <Icon icon={windowType.icon} size="sm" />}
      <span className={styles.title}>
        {windowType === undefined ? windowTypeId : translate(windowType.title)}
      </span>
    </div>
  );
}
