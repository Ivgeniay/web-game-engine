import { defineMessages } from '@/core/i18n/messages';

export const numberFieldMessages = defineMessages({
  en: {
    incomplete: 'Enter a number',
    belowMin: 'The minimum is {min}',
    aboveMax: 'The maximum is {max}',
  },
  ru: {
    incomplete: 'Введите число',
    belowMin: 'Минимум — {min}',
    aboveMax: 'Максимум — {max}',
  },
});
