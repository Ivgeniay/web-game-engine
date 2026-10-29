import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import type { ReferenceFieldLabels } from '@/ui/referenceField/ReferenceField';
import { pickerDialogMessages } from './pickerDialogMessages';

export function useReferenceFieldLabels(): ReferenceFieldLabels {
  const t = useMessages(pickerDialogMessages);

  return useMemo(() => ({ none: t('none'), openPicker: t('openPicker'), clear: t('clear') }), [t]);
}
