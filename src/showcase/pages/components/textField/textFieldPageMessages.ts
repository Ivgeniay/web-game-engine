import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const textFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'TextField',
    pageDescription: 'A one-line text input that commits on Enter or blur and reverts on Esc.',
  },
  ru: {
    pageTitle: 'TextField',
    pageDescription:
      'Однострочное поле текста: фиксирует значение по Enter или потере фокуса, Esc возвращает прежнее.',
  },
});
