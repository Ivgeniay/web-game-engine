import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const buttonPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Button',
    pageDescription: 'A button with text and an optional icon that runs an action.',
    variantsTitle: 'Variants',
    variantsText: '`variant` sets the look:',
    variantsItem: '`default` is a regular action;',
    variantsItem2: '`accent` is the primary action, at most one per group of buttons;',
    variantsItem3: '`flat` has no background or border at rest and is meant for toolbars.',
    variantsText2:
      'The text is the only child and must be a ready string: primitives know nothing about localization, so pass a translated text from `useMessages`.',
    sizesTitle: 'Sizes',
    sizesText:
      '`size` is `sm`, `md` (the default) or `lg`. The height comes from the `--size-control-height-*` tokens.',
    iconTitle: 'Icon',
    iconText:
      '`icon` takes an icon of a set or an `iconRef`, the same as `Icon`, and shows it before the text. Its size follows the button: 12 pixels for `sm`, 16 pixels for `md` and `lg`. For a button without text use `IconButton`.',
    disabledTitle: 'Disabled',
    disabledText:
      '`disabled` is the native attribute. A disabled button ignores the mouse and the keyboard, leaves the Tab order and shows its text in `--color-text-disabled`. A disabled accent button looks like a disabled default one. In toolbars, add `focusableWhenDisabled` to keep a disabled button reachable from the keyboard: see the [Toolbar](components/toolbar) page.',
    keyboardFocusTitle: 'Keyboard and focus',
    keyboardFocusText:
      'The button is a native `button` with `type="button"`: Tab reaches it, Enter and Space press it. The focus outline shows only for keyboard focus. On an accent button the outline is drawn outside with a one pixel gap, so it lies on the surface around the button and stays visible against the accent color.',
    otherPropsTitle: 'Other props',
    otherPropsItem: '`ref` receives the `button` element, for example to anchor a popup.',
    otherPropsItem2:
      'Native button attributes and event handlers pass through, except `style`, `type` and `children`.',
    otherPropsItem3:
      '`className` is for placing the button in a layout: margins, flex and grid properties. Do not recolor a button through it; the look changes only with `variant` and `size`.',
  },
  ru: {
    pageTitle: 'Button',
    pageDescription: 'Кнопка с текстом и необязательной иконкой, которая выполняет действие.',
    variantsTitle: 'Варианты',
    variantsText: '`variant` задаёт внешний вид:',
    variantsItem: '`default` — обычное действие;',
    variantsItem2: '`accent` — главное действие, не больше одного на группу кнопок;',
    variantsItem3: '`flat` в покое без фона и рамки, он для панелей инструментов.',
    variantsText2:
      'Текст — единственный дочерний элемент, и это должна быть готовая строка: примитивы ничего не знают о локализации, поэтому передавайте переведённый текст из `useMessages`.',
    sizesTitle: 'Размеры',
    sizesText:
      '`size` — `sm`, `md` (по умолчанию) или `lg`. Высота берётся из токенов `--size-control-height-*`.',
    iconTitle: 'Иконка',
    iconText:
      '`icon` принимает иконку набора или `iconRef`, как и `Icon`, и показывает её перед текстом. Размер иконки следует за кнопкой: 12 пикселей для `sm`, 16 пикселей для `md` и `lg`. Для кнопки без текста есть `IconButton`.',
    disabledTitle: 'Отключённая кнопка',
    disabledText:
      '`disabled` — нативный атрибут. Отключённая кнопка не реагирует на мышь и клавиатуру, выпадает из порядка Tab и показывает текст цветом `--color-text-disabled`. Отключённая акцентная кнопка выглядит так же, как отключённая обычная. В панелях инструментов добавьте `focusableWhenDisabled`, чтобы отключённая кнопка оставалась доступной с клавиатуры: см. страницу [Toolbar](components/toolbar).',
    keyboardFocusTitle: 'Клавиатура и фокус',
    keyboardFocusText:
      'Кнопка — нативный `button` с `type="button"`: до неё доходит Tab, Enter и пробел нажимают её. Рамка фокуса видна только при фокусе с клавиатуры. У акцентной кнопки рамка рисуется снаружи с зазором в один пиксель: она лежит на поверхности вокруг кнопки и остаётся заметной на акцентном цвете.',
    otherPropsTitle: 'Остальные пропсы',
    otherPropsItem:
      '`ref` получает элемент `button`, например чтобы привязать к нему всплывающий элемент.',
    otherPropsItem2:
      'Нативные атрибуты и обработчики событий кнопки передаются дальше, кроме `style`, `type` и `children`.',
    otherPropsItem3:
      '`className` — для размещения кнопки в раскладке: внешние отступы, свойства flex и grid. Не перекрашивайте кнопку через него: внешний вид меняется только через `variant` и `size`.',
  },
});
