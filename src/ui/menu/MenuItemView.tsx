import styles from './Menu.module.css';
import type { MenuItem } from './menuItems';
import { MenuRow } from './MenuRow';
import { MenuSubmenu } from './MenuSubmenu';

interface MenuItemViewProps {
  readonly item: MenuItem;
}

export function MenuItemView({ item }: MenuItemViewProps) {
  switch (item.kind) {
    case 'action':
      return (
        <MenuRow
          role="menuitem"
          label={item.label}
          icon={item.icon}
          shortcut={item.shortcut}
          disabled={item.disabled}
          onSelect={item.onSelect}
        />
      );
    case 'checkbox':
      return (
        <MenuRow
          role="menuitemcheckbox"
          label={item.label}
          checked={item.checked}
          keepOpen={item.keepOpen}
          shortcut={item.shortcut}
          disabled={item.disabled}
          onSelect={() => {
            item.onCheckedChange(item.checked !== true);
          }}
        />
      );
    case 'radio-group':
      return (
        <div role="group" aria-label={item.label}>
          {item.options.map((option) => (
            <MenuRow
              key={option.value}
              role="menuitemradio"
              label={option.label}
              checked={option.value === item.value}
              shortcut={option.shortcut}
              disabled={option.disabled}
              onSelect={() => {
                item.onValueChange(option.value);
              }}
            />
          ))}
        </div>
      );
    case 'submenu':
      return <MenuSubmenu item={item} />;
    case 'separator':
      return <div className={styles.separator} role="separator" />;
    case 'section':
      return (
        <div className={styles.section} role="presentation">
          {item.label}
        </div>
      );
  }
}
