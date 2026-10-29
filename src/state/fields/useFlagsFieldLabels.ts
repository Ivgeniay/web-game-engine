import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import { flagsFieldMessages } from './flagsFieldMessages';

export interface FlagsFieldLabels {
  readonly noneLabel: string;
  readonly allLabel: string;
  readonly mixedLabel: string;
}

export function useFlagsFieldLabels(): FlagsFieldLabels {
  const t = useMessages(flagsFieldMessages);

  return useMemo(() => ({ noneLabel: t('none'), allLabel: t('all'), mixedLabel: t('mixed') }), [t]);
}
