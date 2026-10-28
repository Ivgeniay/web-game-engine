import { classNames } from '@/ui/classNames';
import styles from './Kbd.module.css';

interface KbdProps {
  readonly children: string;
  readonly className?: string | undefined;
}

export function Kbd({ children, className }: KbdProps) {
  return <kbd className={classNames(styles.root, className)}>{children}</kbd>;
}
