import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const typographyPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Typography',
    pageDescription: 'Font families, sizes, weights and line heights for interface text and code.',
    usageTitle: 'Usage',
    usageFamily:
      '`font-family-ui` is for interface text, `font-family-mono` for code, values and identifiers.',
    usageSize:
      '`font-size-md` is the base interface size. Smaller sizes are for secondary details, larger ones for headings.',
    usageLineHeight:
      '`font-line-height-compact` fits single-line controls, `font-line-height-multiline` is for paragraphs and code.',
    tokensTitle: 'Tokens',
  },
  ru: {
    pageTitle: 'Типографика',
    pageDescription:
      'Семейства, размеры и начертания шрифтов и высота строки для текста интерфейса и кода.',
    usageTitle: 'Применение',
    usageFamily:
      '`font-family-ui` — для текста интерфейса, `font-family-mono` — для кода, значений и идентификаторов.',
    usageSize:
      '`font-size-md` — основной размер интерфейса. Меньшие размеры — для второстепенных деталей, бóльшие — для заголовков.',
    usageLineHeight:
      '`font-line-height-compact` подходит однострочным элементам управления, `font-line-height-multiline` — абзацам и коду.',
    tokensTitle: 'Токены',
  },
});
