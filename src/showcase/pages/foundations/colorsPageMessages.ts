import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const colorsPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Colors',
    pageDescription: 'All color tokens and their roles. Use them for every color in the interface.',
    rolesTitle: 'Roles',
    rolesIntro:
      'Color tokens are named by role. Pick a token by what the element is, not by its look.',
    rolesBackground:
      '`bg-*` are surfaces: app, panels, headers, fields, controls, popups and selection.',
    rolesText: '`text-*` are text colors. Every text uses one of them.',
    rolesBorder:
      '`border-*` are separators, control borders, the focus outline and the line that shows where a dragged row will be inserted.',
    rolesAccent:
      '`accent`, `accent-hover` and `accent-active` mark the primary action in its normal, hovered and pressed states, with `text-on-accent` on top.',
    rolesStatus: '`status-*` are for icons, borders and indicators only, never for text.',
    rolesOverlay:
      '`overlay-*` are translucent layers: `overlay-hover` and `overlay-active` for hover and pressed states, `overlay-backdrop` to dim the editor behind a dialog, `overlay-drop-target` to highlight where a dragged window or row will land.',
    rolesSpecific:
      '`axis-*`, `checker-*`, `playmode-tint`, `scrollbar-*` and `shadow` serve their specific editor elements; `checker-*` draws the checkerboard under transparent colors.',
    tokensTitle: 'Tokens',
    tokensText: 'Values are shown for the current theme.',
  },
  ru: {
    pageTitle: 'Цвета',
    pageDescription: 'Все цветовые токены и их роли. Любой цвет в интерфейсе берётся из них.',
    rolesTitle: 'Роли',
    rolesIntro:
      'Цветовые токены названы по роли. Выбирайте токен по тому, чем является элемент, а не по тому, как он выглядит.',
    rolesBackground:
      '`bg-*` — поверхности: приложение, панели, заголовки, поля, элементы управления, всплывающие элементы и выделение.',
    rolesText: '`text-*` — цвета текста. Любой текст пишется одним из них.',
    rolesBorder:
      '`border-*` — разделители, рамки элементов управления, рамка фокуса и линия, которая показывает, куда встанет перетаскиваемая строка.',
    rolesAccent:
      '`accent`, `accent-hover` и `accent-active` выделяют главное действие в обычном состоянии, при наведении и при нажатии, а текст на них — `text-on-accent`.',
    rolesStatus: '`status-*` — только для иконок, рамок и индикаторов, никогда для текста.',
    rolesOverlay:
      '`overlay-*` — полупрозрачные слои: `overlay-hover` и `overlay-active` для наведения и нажатия, `overlay-backdrop` затемняет редактор под диалогом, `overlay-drop-target` подсвечивает место, куда ляжет перетаскиваемое окно или строка.',
    rolesSpecific:
      '`axis-*`, `checker-*`, `playmode-tint`, `scrollbar-*` и `shadow` служат своим отдельным элементам редактора; `checker-*` рисует шахматку под прозрачными цветами.',
    tokensTitle: 'Токены',
    tokensText: 'Значения показаны для текущей темы.',
  },
});
