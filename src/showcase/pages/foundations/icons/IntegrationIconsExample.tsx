import { circle, defineIcon, defineIcons, iconRef, stroke } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import styles from './IntegrationIconsExample.module.css';

const pinIcon = defineIcon({
  md: [circle(7.5, 5.5, 3), stroke('M7.5 9.5 V13.5')],
});

const engineIcons = defineIcons({ pin: pinIcon });

export function IntegrationIconsExample() {
  return (
    <div className={styles.root}>
      <Icon icon={engineIcons.pin} />
      <Icon icon={engineIcons.pin} size="sm" />
      <Icon icon={iconRef(engineIcons, 'pin')} />
    </div>
  );
}
