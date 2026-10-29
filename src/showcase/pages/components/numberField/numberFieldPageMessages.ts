import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const numberFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'NumberField',
    pageDescription: 'An integer or float input with a typing filter, a range and arrow steps.',
    typingNumberTitle: 'Typing a number',
    typingNumberText:
      'A number field edits a `number`. It works like a text field: the value is controlled, changes arrive through `onValueChange(value, phase)` with the preview, commit and cancel phases, the field commits on Enter or blur by default and reverts on Esc, and `updateMode="live"` previews every valid input.',
    typingNumberText2:
      'The field lets in only what can become a number: digits, one minus at the start when the minimum allows negative values, and for a float one decimal separator. Both a point and a comma work as the separator. A character that does not fit is not typed, and a paste that does not fit is rejected as a whole. The value is shown with the separator of the interface language and without digit grouping: switch the language in the header to see it. The field reads the language from a locale context that `StoresProvider` fills; outside it the field uses English.',
    typingNumberText3:
      '`precision` limits the shown decimal places, 3 by default. It changes only the display: focusing and leaving the field without typing commits nothing, so the stored value keeps all its digits.',
    integersRangeTitle: 'Integers, range and step',
    integersRangeText:
      '`kind="integer"` accepts only whole numbers; the default is `float`. `min` and `max` set the range. A number out of range or an unfinished one, such as a lone minus, shows the invalid state: an error border, `aria-invalid` and a message in a bubble. On commit a number out of range moves to the nearest limit, and an empty or unfinished text returns the last valid value. Integers also stay within the safe integer range of JavaScript.',
    integersRangeText2:
      'The messages come ready through `invalidMessages`, because the field does not translate. `useNumberFieldMessages({ min, max })` from `@/state/fields` gives translated messages with the limits in them.',
    integersRangeText3:
      'The Up and Down arrows change the value by `step`: 1 for an integer and 0.1 for a float by default. With Shift the step is ten times finer, with Alt ten times coarser; an integer still moves by at least one. Arrow steps are previews, so a series of presses ends with one commit on Enter or blur, and Esc returns the value from before the first press. Floating point noise is rounded away: 0.2 and 0.1 give 0.3.',
    mixedReadTitle: 'Mixed, read-only and disabled',
    mixedReadText:
      '`mixed` shows a dash for different values of several selected objects, and any edit is committed so the owner can apply it to every object. A read-only field stays in the Tab order and ignores typing and the arrows. A disabled field leaves the Tab order.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      'The field is a text input with the `spinbutton` role, so screen readers announce the value and the limits. To change the value by dragging its caption, put the field in a `PropertyRow` with `drag`. Expressions such as `2*3` and large integers beyond `number` are not supported yet. Esc that cancels an edit does not reach a dialog, popover or menu around the field; the next Esc closes it. `size`, `ref`, native attributes and `className` work as in the text field.',
  },
  ru: {
    pageTitle: 'NumberField',
    pageDescription:
      'Поле целого или дробного числа с фильтром ввода, диапазоном и шагом по стрелкам.',
    typingNumberTitle: 'Ввод числа',
    typingNumberText:
      'Числовое поле редактирует `number`. Оно работает как текстовое: значение управляемое, изменения приходят через `onValueChange(value, phase)` с фазами предпросмотра, фиксации и отмены, по умолчанию поле фиксирует значение по Enter или потере фокуса и возвращает прежнее по Esc, а `updateMode="live"` даёт предпросмотр на каждый корректный ввод.',
    typingNumberText2:
      'Поле пропускает только то, что может стать числом: цифры, один минус в начале, если минимум допускает отрицательные значения, и для дробного числа один десятичный разделитель. Разделителем работают и точка, и запятая. Неподходящий символ не вводится, неподходящая вставка отклоняется целиком. Значение показывается с разделителем языка интерфейса и без разделителя разрядов: переключите язык в шапке, чтобы это увидеть. Язык поле берёт из контекста локали, который наполняет `StoresProvider`; вне его поле использует английский.',
    typingNumberText3:
      '`precision` ограничивает число показанных знаков после запятой, по умолчанию 3. Это меняет только отображение: вход в поле и выход без ввода ничего не фиксируют, поэтому сохранённое значение сохраняет все свои знаки.',
    integersRangeTitle: 'Целые числа, диапазон и шаг',
    integersRangeText:
      '`kind="integer"` принимает только целые числа; по умолчанию — `float`. `min` и `max` задают диапазон. Число вне диапазона или незаконченное, например одинокий минус, показывает состояние ошибки: рамку ошибки, `aria-invalid` и сообщение в пузыре. При фиксации число вне диапазона приводится к ближайшей границе, а пустой или незаконченный текст возвращает последнее корректное значение. Целые числа к тому же остаются в безопасном целочисленном диапазоне JavaScript.',
    integersRangeText2:
      'Сообщения приходят готовыми через `invalidMessages`, потому что поле не переводит. `useNumberFieldMessages({ min, max })` из `@/state/fields` даёт переведённые сообщения с границами.',
    integersRangeText3:
      'Стрелки вверх и вниз меняют значение на `step`: по умолчанию 1 для целого и 0,1 для дробного. С Shift шаг в десять раз мельче, с Alt — в десять раз крупнее; целое всё равно меняется хотя бы на единицу. Шаги стрелками — это предпросмотр, поэтому серия нажатий заканчивается одной фиксацией по Enter или потере фокуса, а Esc возвращает значение до первого нажатия. Погрешность дробных чисел округляется: 0,2 и 0,1 дают 0,3.',
    mixedReadTitle: 'Смешанное, только чтение и отключённое',
    mixedReadText:
      '`mixed` показывает черту для разных значений у нескольких выбранных объектов, и любая правка фиксируется, чтобы владелец мог применить её ко всем объектам. Поле только для чтения остаётся в порядке Tab и не реагирует на ввод и стрелки. Отключённое поле выпадает из порядка Tab.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Поле — текстовый ввод с ролью `spinbutton`, поэтому скринридеры объявляют значение и границы. Чтобы менять значение перетаскиванием подписи, поставьте поле в `PropertyRow` с `drag`. Выражения вроде `2*3` и большие целые за пределами `number` пока не поддерживаются. Esc, который отменил правку, не доходит до диалога, всплывающей панели или меню вокруг поля; их закрывает следующий Esc. `size`, `ref`, нативные атрибуты и `className` работают как у текстового поля.',
  },
});
