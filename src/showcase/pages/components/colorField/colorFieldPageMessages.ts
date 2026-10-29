import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const colorFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ColorField',
    pageDescription:
      'A color swatch that opens a color picker and makes one undo entry per choice.',
    swatchTitle: 'Swatch and picker',
    swatchText:
      'A color field shows a `Color` as a swatch over a checkerboard, with a bar along its bottom edge for the alpha channel. A click, Enter or Space opens a [ColorPicker](components/color-picker) in a [Popover](components/popover). `showAlpha={false}` drops the bar and the alpha controls and keeps the color opaque. The color of the swatch is an inline style, because it is data and not a design value.',
    swatchText2:
      'The whole choice is one session. Every change in the picker reaches the owner as a preview, so the scene follows it. Closing the picker by a click outside, by the swatch or by leaving it with Tab commits the last color once, so `useUndoableValue` records one entry. Esc closes the picker and cancels back to the color it opened with. Closing without a change sends nothing. Where the browser has the `EyeDropper` API, a button next to the swatch picks a color from the screen with one commit.',
    mixedTitle: 'Mixed and disabled',
    mixedText:
      '`mixed` shows a dash instead of the swatch; the picker opens on `value`, and the chosen color is committed so the owner applies it to every selected object. A disabled field does not open and leaves the Tab order.',
    keyboardTitle: 'Keyboard and props',
    keyboardText:
      'The swatch is a button with `aria-haspopup="dialog"`, and the eyedropper is a separate Tab stop. Inside the picker the first Esc cancels a typed number or hex, the next one closes the picker and cancels the choice. `labels` takes the translated captions from `useColorFieldLabels()`, `colorMode` and `onColorModeChange` pass to the picker. In a `PropertyRow` give the field `id` and `aria-labelledby` from the row.',
  },
  ru: {
    pageTitle: 'ColorField',
    pageDescription:
      'Образец цвета, который открывает окно выбора цвета и даёт одну запись отмены на выбор.',
    swatchTitle: 'Образец и окно выбора',
    swatchText:
      'Поле цвета показывает `Color` образцом поверх шахматки с полоской альфа-канала по нижнему краю. Клик, Enter или пробел открывают [ColorPicker](components/color-picker) во [Popover](components/popover). `showAlpha={false}` убирает полоску и элементы альфа-канала и оставляет цвет непрозрачным. Цвет образца — инлайн-стиль, потому что это данные, а не дизайн-значение.',
    swatchText2:
      'Весь выбор — один сеанс. Каждое изменение в окне приходит владельцу как предпросмотр, и сцена следует за ним. Закрытие окна кликом снаружи, по образцу или уходом из окна по Tab фиксирует последний цвет один раз, поэтому `useUndoableValue` записывает одну запись. Esc закрывает окно и отменяет выбор до цвета, с которым окно открылось. Закрытие без изменений ничего не отправляет. Где в браузере есть `EyeDropper` API, кнопка рядом с образцом берёт цвет с экрана одной фиксацией.',
    mixedTitle: 'Смешанное и отключённое',
    mixedText:
      '`mixed` показывает черту вместо образца; окно открывается на `value`, а выбранный цвет фиксируется, чтобы владелец применил его ко всем выбранным объектам. Отключённое поле не открывается и выпадает из порядка Tab.',
    keyboardTitle: 'Клавиатура и пропсы',
    keyboardText:
      'Образец — кнопка с `aria-haspopup="dialog"`, а пипетка — отдельная остановка Tab. Внутри окна первый Esc отменяет набранное число или HEX, следующий закрывает окно и отменяет выбор. `labels` получает переведённые подписи из `useColorFieldLabels()`, `colorMode` и `onColorModeChange` передаются окну. В `PropertyRow` передайте полю `id` и `aria-labelledby` из строки.',
  },
});
