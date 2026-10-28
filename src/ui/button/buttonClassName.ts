import type { IconSize } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import styles from './buttonStyles.module.css';

export const BUTTON_VARIANTS = ['default', 'accent', 'flat'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SHAPES = ['text', 'square'] as const;

export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export const BUTTON_ICON_SIZES: Readonly<Record<ButtonSize, IconSize>> = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

export interface ButtonClassNameOptions {
  readonly variant: ButtonVariant;
  readonly size: ButtonSize;
  readonly shape: ButtonShape;
  readonly className: string | undefined;
}

export function buttonClassName({
  variant,
  size,
  shape,
  className,
}: ButtonClassNameOptions): string {
  return classNames(styles.root, styles[variant], styles[size], styles[shape], className);
}

export const buttonLabelClassName = styles.label;
