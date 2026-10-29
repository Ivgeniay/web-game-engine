import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const radiusAndShadowsPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Radius and shadows',
    pageDescription: 'Corner radii and shadows for surfaces and floating elements.',
    radiusTitle: 'Radius',
    radiusText:
      'Corner radii. Editor surfaces are mostly sharp or slightly rounded, `radius-full` is for pills and round indicators.',
    shadowsTitle: 'Shadows',
    shadowsText:
      'Shadows separate floating elements from the content below: popups, menus and tooltips. Docked panels have no shadow.',
  },
  ru: {
    pageTitle: 'Скругления и тени',
    pageDescription: 'Радиусы скругления углов и тени для поверхностей и всплывающих элементов.',
    radiusTitle: 'Скругления',
    radiusText:
      'Радиусы скругления углов. Поверхности редактора в основном с острыми или слегка скруглёнными углами, `radius-full` — для капсул и круглых индикаторов.',
    shadowsTitle: 'Тени',
    shadowsText:
      'Тени отделяют всплывающие элементы от содержимого под ними: всплывающие панели, меню и подсказки. У пристыкованных панелей тени нет.',
  },
});
