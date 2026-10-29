import { useMemo } from 'react';
import { demoMessages } from '@/demo/demoMessages';
import type { ComponentKind } from '@/demo/scene/sceneComponents';
import { inspectorComponentMenu } from '@/demo/windows/demoWindowCommands';
import { useContextMenuItems } from '@/shell/useContextMenuItems';
import { useMessages } from '@/state/language/useMessages';
import type { MenuItem } from '@/ui/menu/menuItems';

export interface ComponentMenu {
  readonly menuItems: readonly MenuItem[];
  readonly menuLabel: string;
}

export function useComponentMenu(component: ComponentKind, title: string): ComponentMenu {
  const t = useMessages(demoMessages);
  const target = useMemo(() => ({ component }), [component]);

  return {
    menuItems: useContextMenuItems(inspectorComponentMenu, target),
    menuLabel: t('componentMenu', { component: title }),
  };
}
