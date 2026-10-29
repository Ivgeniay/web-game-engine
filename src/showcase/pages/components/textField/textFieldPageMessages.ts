import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const textFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'TextField',
    pageDescription: 'A one-line text input that commits on Enter or blur and reverts on Esc.',
    editingCommittingTitle: 'Editing and committing',
    editingCommittingText:
      'A text field edits one line of text. The value is controlled: `value` sets it, and `onValueChange(value, phase)` receives changes together with their phase from the value change protocol in `@/contracts/valueChange`.',
    editingCommittingText2:
      'By default the field is delayed: typing changes only the text inside the field, and the owner receives one `commit` on Enter or when focus leaves the field, Tab included. Leaving the field without changes commits nothing. Esc drops the typed text, returns the value and leaves the field. While a draft is being typed, a new `value` from outside waits until the edit ends. The field has no caption of its own: point a `Label` to it with `htmlFor`, use `aria-label`, or let a property row give the caption.',
    liveUpdatesTitle: 'Live updates and the protocol',
    liveUpdatesText:
      'With `updateMode="live"` every input reaches the owner as a `preview`, so the scene can follow the typing. Enter or leaving the field ends the edit with one `commit`, and Esc ends it with a `cancel` that carries the value from the start of the edit. An undo stack records one entry on `commit` and ignores previews. An owner that does not care about phases can pass a plain setter: every phase carries the value to show.',
    invalidValueTitle: 'Invalid value',
    invalidValueText:
      '`validate` receives the typed text and returns a message for an invalid text or `undefined` for a valid one. While the text is invalid, the field shows an error border, sets `aria-invalid` and shows the message in a bubble linked with `aria-describedby`. An invalid text is never committed or previewed: Enter and leaving the field return the last valid value. Clear the field below or type a slash to see it.',
    readOnlyTitle: 'Read-only, disabled, mixed and password',
    readOnlyText:
      'A read-only field stays in the Tab order and lets you select and copy the text. A disabled field ignores the mouse and the keyboard and leaves the Tab order. `mixed` shows a dash when the selected objects have different values; any edit is committed, even one that matches `value`, so the owner can apply it to every object. `type="password"` hides the text.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      "Ctrl+Z inside the field is the browser's own undo of the typed text. Esc that drops a typed text stays in the field and does not close a dialog, popover or menu around it; the next Esc does. Editor hotkeys do not fire while focus is in the field, except those that allow it. Inside a toolbar the field joins the toolbar's Tab stop and keeps the arrow keys for the caret. `size` takes `sm`, `md` or `lg`. `ref` receives the `input` element, and native input attributes such as `id`, `name`, `placeholder` and `aria-describedby` pass through. `className` goes to the outer box and is meant only for layout.",
  },
  ru: {
    pageTitle: 'TextField',
    pageDescription:
      'Однострочное поле текста: фиксирует значение по Enter или потере фокуса, Esc возвращает прежнее.',
    editingCommittingTitle: 'Редактирование и фиксация',
    editingCommittingText:
      'Текстовое поле редактирует одну строку текста. Значение управляемое: `value` задаёт его, а `onValueChange(value, phase)` получает изменения вместе с фазой из протокола изменения значения `@/contracts/valueChange`.',
    editingCommittingText2:
      'По умолчанию поле отложенное: ввод меняет только текст внутри поля, а владелец получает один `commit` по Enter или когда фокус уходит из поля, в том числе по Tab. Выход из поля без правки ничего не фиксирует. Esc отбрасывает введённый текст, возвращает значение и выходит из поля. Пока набирается черновик, новое `value` снаружи ждёт конца редактирования. Своей подписи у поля нет: привяжите к нему `Label` через `htmlFor`, задайте `aria-label` или дайте подпись строкой свойства.',
    liveUpdatesTitle: 'Живое обновление и протокол',
    liveUpdatesText:
      'При `updateMode="live"` каждый ввод доходит до владельца как `preview`, и сцена может следовать за набором. Enter или уход из поля завершают редактирование одним `commit`, а Esc — фазой `cancel` со значением на начало редактирования. Стек отмены записывает одну запись на `commit` и не замечает предпросмотров. Владельцу, которому фазы не важны, достаточно передать обычный сеттер: каждая фаза несёт значение для показа.',
    invalidValueTitle: 'Некорректное значение',
    invalidValueText:
      '`validate` получает введённый текст и возвращает сообщение для некорректного текста или `undefined` для корректного. Пока текст некорректен, у поля рамка ошибки, атрибут `aria-invalid` и сообщение в пузыре, связанном через `aria-describedby`. Некорректный текст не фиксируется и не уходит в предпросмотр: Enter и уход из поля возвращают последнее корректное значение. Очистите поле ниже или введите косую черту, чтобы это увидеть.',
    readOnlyTitle: 'Только чтение, отключённое, смешанное и пароль',
    readOnlyText:
      'Поле только для чтения остаётся в порядке Tab, текст в нём можно выделить и скопировать. Отключённое поле не реагирует на мышь и клавиатуру и выпадает из порядка Tab. `mixed` показывает черту, когда у выбранных объектов разные значения; любая правка фиксируется, даже совпадающая с `value`, чтобы владелец мог применить её ко всем объектам. `type="password"` скрывает текст.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Ctrl+Z внутри поля — родная отмена браузера для набранного текста. Esc, который отбросил набранный текст, остаётся в поле и не закрывает диалог, всплывающую панель или меню вокруг; это делает следующий Esc. Горячие клавиши редактора не срабатывают, пока фокус в поле, кроме тех, которым это разрешено. Внутри панели инструментов поле встаёт в её остановку Tab и оставляет стрелки для курсора. `size` — `sm`, `md` или `lg`. `ref` получает элемент `input`, а нативные атрибуты поля вроде `id`, `name`, `placeholder` и `aria-describedby` передаются дальше. `className` уходит на внешнюю рамку и нужен только для раскладки.',
  },
});
