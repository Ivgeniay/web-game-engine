import { classNames } from '@/ui/classNames';
import styles from './Kbd.module.css';

export type KbdTone = 'secondary' | 'primary';

interface KbdProps {
  readonly children: string;
  readonly tone?: KbdTone;
  readonly className?: string | undefined;
}

export function Kbd({ children, tone = 'secondary', className }: KbdProps) {
  return <kbd className={classNames(styles.root, styles[tone], className)}>{children}</kbd>;
}
