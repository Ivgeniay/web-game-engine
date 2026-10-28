import type { ComponentType } from 'react';
import type { MessageRef } from '@/core/i18n/translate';
import type { IconSource } from '@/icons/icon';

export interface WindowContentProps {
  readonly windowId: string;
}

export interface WindowTypeInput {
  readonly id: string;
  readonly title: MessageRef;
  readonly icon?: IconSource | undefined;
  readonly component: ComponentType<WindowContentProps>;
  readonly multiInstance?: boolean | undefined;
}

export interface WindowType {
  readonly id: string;
  readonly title: MessageRef;
  readonly icon: IconSource | undefined;
  readonly component: ComponentType<WindowContentProps>;
  readonly multiInstance: boolean;
}

export function defineWindow({
  id,
  title,
  icon,
  component,
  multiInstance = false,
}: WindowTypeInput): WindowType {
  return { id, title, icon, component, multiInstance };
}
