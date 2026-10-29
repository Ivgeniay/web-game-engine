import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import { boundsFieldMessages } from './boundsFieldMessages';

export interface BoundsFieldLabels {
  readonly centerLabel: string;
  readonly sizeLabel: string;
}

export function useBoundsFieldLabels(): BoundsFieldLabels {
  const t = useMessages(boundsFieldMessages);

  return useMemo(() => ({ centerLabel: t('center'), sizeLabel: t('size') }), [t]);
}
