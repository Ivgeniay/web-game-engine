import { classNames } from '@/ui/classNames';
import styles from './Separator.module.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorVariant = 'line' | 'flexible';

interface SeparatorProps {
  readonly orientation?: SeparatorOrientation;
  readonly variant?: SeparatorVariant;
  readonly className?: string | undefined;
}

export function Separator({
  orientation = 'horizontal',
  variant = 'line',
  className,
}: SeparatorProps) {
  if (variant === 'flexible') {
    return <div className={classNames(styles.flexible, className)} aria-hidden="true" />;
  }

  return (
    <div
      className={classNames(styles.line, styles[orientation], className)}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
