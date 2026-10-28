import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import type { NumberFieldMessages } from '@/ui/numberField/numberText';
import { numberFieldMessages } from './numberFieldMessages';

export interface NumberFieldMessageLimits {
  readonly min?: number | undefined;
  readonly max?: number | undefined;
}

const NO_LIMIT_MESSAGE = '';

export function useNumberFieldMessages({
  min,
  max,
}: NumberFieldMessageLimits = {}): NumberFieldMessages {
  const t = useMessages(numberFieldMessages);

  return useMemo(
    () => ({
      incomplete: t('incomplete'),
      belowMin: min === undefined ? NO_LIMIT_MESSAGE : t('belowMin', { min }),
      aboveMax: max === undefined ? NO_LIMIT_MESSAGE : t('aboveMax', { max }),
    }),
    [t, min, max],
  );
}
