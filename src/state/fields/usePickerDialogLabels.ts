import { useMemo } from 'react';
import { commonMessages } from '@/core/i18n/commonMessages';
import { useMessages } from '@/state/language/useMessages';
import type { PickerDialogLabels } from '@/ui/pickerDialog/PickerDialog';
import { pickerDialogMessages } from './pickerDialogMessages';

export function usePickerDialogLabels(): PickerDialogLabels {
  const t = useMessages(pickerDialogMessages);
  const tCommon = useMessages(commonMessages);

  return useMemo(
    () => ({
      search: t('search'),
      clearSearch: t('clearSearch'),
      tabs: t('tabs'),
      view: t('view'),
      listView: t('listView'),
      gridView: t('gridView'),
      scale: t('scale'),
      results: t('results'),
      none: t('none'),
      select: t('select'),
      cancel: tCommon('cancel'),
    }),
    [t, tCommon],
  );
}
