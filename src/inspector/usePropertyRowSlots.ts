import { useMemo } from 'react';
import type { PropertyCommon, PropertyDescription } from '@/contracts/property';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { commonMessages } from '@/core/i18n/commonMessages';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useContextMenuItems } from '@/shell/useContextMenuItems';
import { useMessages } from '@/state/language/useMessages';
import type { MenuItem } from '@/ui/menu/menuItems';
import type { PropertyRowSlots } from '@/ui/propertyRow/PropertyRow';
import { inspectorPropertyMenu } from './inspectorMenus';
import { inspectorMessages } from './inspectorMessages';

export interface PropertyRowSlotsOptions<T> {
  readonly description: PropertyDescription;
  readonly property: PropertyCommon<T>;
  readonly targetIds: readonly string[];
  readonly values: readonly T[];
  readonly equals: (first: T, second: T) => boolean;
  readonly onValueChange: ValueChangeHandler<T>;
}

const RESET_ITEM_ID = 'inspector.reset';
const SEPARATOR_ID = 'inspector.reset-separator';

export function usePropertyRowSlots<T>({
  description,
  property,
  targetIds,
  values,
  equals,
  onValueChange,
}: PropertyRowSlotsOptions<T>): PropertyRowSlots {
  const t = useMessages(inspectorMessages);
  const tCommon = useMessages(commonMessages);
  const target = useMemo(() => ({ property: description, targetIds }), [description, targetIds]);
  const integrationItems = useContextMenuItems(inspectorPropertyMenu, target);
  const { defaultValue, readOnly = false } = property;

  if (defaultValue === undefined) {
    return { menuItems: integrationItems };
  }

  const modified = values.some((value) => !equals(value, defaultValue));
  const resetToDefault = () => {
    onValueChange(defaultValue, 'commit');
  };
  const resetItems: readonly MenuItem[] = [
    ...(integrationItems.length > 0 ? [{ kind: 'separator', id: SEPARATOR_ID } as const] : []),
    {
      kind: 'action',
      id: RESET_ITEM_ID,
      label: tCommon('reset'),
      icon: frameworkIcons.reset,
      disabled: readOnly || !modified,
      onSelect: resetToDefault,
    },
  ];

  return {
    modified,
    reset: readOnly ? undefined : { label: t('resetToDefault'), onReset: resetToDefault },
    menuItems: [...integrationItems, ...resetItems],
  };
}
