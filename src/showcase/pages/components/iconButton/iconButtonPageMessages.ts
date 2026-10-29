import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const iconButtonPageMessages = defineDocMessages({
  en: {
    pageTitle: 'IconButton',
    pageDescription: 'A square button with only an icon and a required label.',
    labelIconTitle: 'Label and icon',
    labelIconText:
      '`IconButton` shows only an icon. `label` is required: it names the button for screen readers through `aria-label` and is shown in a `Tooltip` on hover and on keyboard focus. `shortcut` adds a key combination to the tooltip; only then the tooltip also describes the button through `aria-describedby`, so a screen reader does not read the label twice.',
    labelIconText2:
      '`icon` takes an icon of a set or an `iconRef`. `variant` is the same as for `Button`, with `flat` as the default, since icon buttons usually sit in toolbars and headers. Disabled icon buttons behave like disabled buttons, including `focusableWhenDisabled`, which keeps the tooltip of a disabled button in a toolbar.',
    sizesTitle: 'Sizes',
    sizesText:
      'The button is square, its side equals the control height of its `size`. The icon is 12 pixels for `sm` and 16 pixels for `md` and `lg`.',
    keyboardFocusTitle: 'Keyboard, focus and other props',
    keyboardFocusText:
      'Keyboard and focus work as for `Button`: Tab reaches it, Enter and Space press it. `ref`, native attributes and `className` work the same way too, except that `aria-label` comes from `label` and `title` is not accepted: the tooltip replaces it.',
  },
  ru: {
    pageTitle: 'IconButton',
    pageDescription: 'Квадратная кнопка только с иконкой и обязательной подписью.',
    labelIconTitle: 'Подпись и иконка',
    labelIconText:
      '`IconButton` показывает только иконку. `label` обязателен: он называет кнопку для скринридеров через `aria-label` и показывается в `Tooltip` при наведении и фокусе с клавиатуры. `shortcut` добавляет в подсказку сочетание клавиш; только тогда подсказка ещё и описывает кнопку через `aria-describedby`, чтобы скринридер не прочитал подпись дважды.',
    labelIconText2:
      '`icon` принимает иконку набора или `iconRef`. `variant` — тот же, что у `Button`, но по умолчанию `flat`: кнопки-иконки обычно стоят в панелях инструментов и заголовках. Отключённые кнопки-иконки ведут себя как отключённые кнопки, включая `focusableWhenDisabled`, который сохраняет подсказку отключённой кнопки в панели инструментов.',
    sizesTitle: 'Размеры',
    sizesText:
      'Кнопка квадратная, её сторона равна высоте элемента управления для её `size`. Иконка — 12 пикселей для `sm` и 16 пикселей для `md` и `lg`.',
    keyboardFocusTitle: 'Клавиатура, фокус и остальные пропсы',
    keyboardFocusText:
      'Клавиатура и фокус работают как у `Button`: до кнопки доходит Tab, Enter и пробел нажимают её. `ref`, нативные атрибуты и `className` тоже работают так же, только `aria-label` берётся из `label`, а `title` не принимается: его заменяет подсказка.',
  },
});
