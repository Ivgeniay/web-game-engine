import type { ComponentType } from 'react';
import type { InspectorSectionProps } from '@/contracts/inspector';
import { createRegistry } from '@/core/registry/registry';
import type { Registry } from '@/core/registry/registry';

export interface InspectorSectionRenderer {
  readonly type: string;
  readonly component: ComponentType<InspectorSectionProps>;
}

export type InspectorSectionRegistry = Registry<InspectorSectionRenderer>;

export function createInspectorSectionRegistry(): InspectorSectionRegistry {
  return createRegistry<InspectorSectionRenderer>({
    kind: 'inspector section renderer',
    getId: (renderer) => renderer.type,
  });
}
