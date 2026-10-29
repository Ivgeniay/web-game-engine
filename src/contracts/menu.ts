import type { IconSource } from '@/icons/icon';

export interface MenuActionItem {
  readonly kind: 'action';
  readonly id: string;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly shortcut?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly onSelect: () => void;
}

export type MenuCheckedState = boolean | 'mixed';

export interface MenuCheckboxItem {
  readonly kind: 'checkbox';
  readonly id: string;
  readonly label: string;
  readonly shortcut?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly checked: MenuCheckedState;
  readonly keepOpen?: boolean | undefined;
  readonly onCheckedChange: (checked: boolean) => void;
}

export interface MenuRadioOption {
  readonly value: string;
  readonly label: string;
  readonly shortcut?: string | undefined;
  readonly disabled?: boolean | undefined;
}

export interface MenuRadioGroupItem {
  readonly kind: 'radio-group';
  readonly id: string;
  readonly label?: string | undefined;
  readonly value: string;
  readonly options: readonly MenuRadioOption[];
  readonly onValueChange: (value: string) => void;
}

export interface MenuSubmenuItem {
  readonly kind: 'submenu';
  readonly id: string;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly disabled?: boolean | undefined;
  readonly items: readonly MenuItem[];
}

export interface MenuSeparatorItem {
  readonly kind: 'separator';
  readonly id: string;
}

export interface MenuSectionItem {
  readonly kind: 'section';
  readonly id: string;
  readonly label: string;
}

export type MenuItem =
  | MenuActionItem
  | MenuCheckboxItem
  | MenuRadioGroupItem
  | MenuSubmenuItem
  | MenuSeparatorItem
  | MenuSectionItem;
