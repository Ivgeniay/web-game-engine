import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const contrastPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Contrast',
    pageDescription:
      'Contrast ratios of the color pairs used in the interface, for the current theme.',
    thresholdsTitle: 'Thresholds',
    thresholdsCheck:
      'Color pairs that appear in the interface are checked against WCAG contrast thresholds: 4.5 for text, 3 for indicators and borders. The pairs are listed in `src/themes/contrastPairs.ts`, and `src/themes/themes.test.ts` fails when a pair in either theme drops below its threshold.',
    thresholdsNewPair:
      'When a component puts a new color combination on screen, add the pair to the list so the test covers it.',
    pairsTitle: 'Pairs',
    pairsText: 'Ratios are shown for the current theme.',
  },
  ru: {
    pageTitle: 'Контраст',
    pageDescription: 'Контрастность цветовых пар интерфейса в текущей теме.',
    thresholdsTitle: 'Пороги',
    thresholdsCheck:
      'Цветовые пары, которые встречаются в интерфейсе, проверяются по порогам контрастности WCAG: 4,5 для текста, 3 для индикаторов и рамок. Пары перечислены в `src/themes/contrastPairs.ts`, а `src/themes/themes.test.ts` падает, если пара в любой из тем опускается ниже своего порога.',
    thresholdsNewPair:
      'Если компонент выводит на экран новое сочетание цветов, добавьте пару в список, чтобы его проверял тест.',
    pairsTitle: 'Пары',
    pairsText: 'Контрастность показана для текущей темы.',
  },
});
