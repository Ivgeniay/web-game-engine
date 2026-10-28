import { createRegistry } from '@/core/registry/registry';
import type { Registry } from '@/core/registry/registry';
import type { WindowType } from './windowType';

export type WindowRegistry = Registry<WindowType>;

export function createWindowRegistry(): WindowRegistry {
  return createRegistry<WindowType>({ kind: 'window type', getId: (windowType) => windowType.id });
}
