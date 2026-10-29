import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const spacingPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Spacing',
    pageDescription: 'The spacing scale for paddings, margins and gaps.',
    usageTitle: 'Usage',
    usageText:
      'Paddings, margins and gaps use the spacing scale. The token name is its size in pixels, so a value that is not on the scale is a sign to pick the nearest step instead.',
    tokensTitle: 'Tokens',
  },
  ru: {
    pageTitle: 'Отступы',
    pageDescription: 'Шкала отступов: внутренние и внешние отступы и промежутки между элементами.',
    usageTitle: 'Применение',
    usageText:
      'Внутренние и внешние отступы и промежутки берутся из шкалы отступов. Имя токена — его размер в пикселях, поэтому значение не со шкалы — повод взять ближайший шаг.',
    tokensTitle: 'Токены',
  },
});
