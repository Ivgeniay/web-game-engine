import { unknownIcon } from '@/icons/framework/unknown';
import type { IconDefinition, IconSource } from './icon';

export interface ResolvedIcon {
  readonly definition: IconDefinition;
  readonly missingName: string | undefined;
}

export function resolveIcon(source: IconSource): ResolvedIcon {
  if (!('set' in source)) {
    return { definition: source, missingName: undefined };
  }

  const definition = Object.hasOwn(source.set, source.name) ? source.set[source.name] : undefined;

  return definition === undefined
    ? { definition: unknownIcon, missingName: source.name }
    : { definition, missingName: undefined };
}
