import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const textAreaPageMessages = defineDocMessages({
  en: {
    pageTitle: 'TextArea',
    pageDescription: 'A multiline text input that grows with its text and commits on Ctrl+Enter.',
    editingTitle: 'Editing several lines',
    editingText:
      'A multiline field works like a [TextField](components/text-field): the value is controlled, changes arrive through `onValueChange(value, phase)`, and `updateMode="live"` previews every input. The difference is the keys: Enter inserts a line break, and Ctrl+Enter (⌘+Enter on macOS) commits and keeps the focus. Leaving the field also commits, and Esc drops the typed text and leaves the field.',
    editingText2:
      'The field grows with its text from `minRows` (2 by default) to `maxRows` (8 by default) and scrolls after that. The height follows the width too: a narrower panel wraps the text into more lines. The user cannot resize the field by hand.',
    statesTitle: 'Invalid, mixed and read-only',
    statesText:
      '`validate` marks an invalid text with an error border and a message bubble, as in a text field, and an invalid text is never committed: clear the first field to see it. `mixed` shows a dash for different notes of several objects. A read-only field stays in the Tab order and lets you select and copy the text; a disabled one leaves the Tab order.',
    keyboardOtherTitle: 'Keyboard and other props',
    keyboardOtherText:
      "Tab leaves the field, so it never inserts a tab character. Ctrl+Z before the commit is the browser's own undo. Esc that drops a typed text does not close a dialog, popover or menu around the field. The field is built on the same base as the text field, so `data-value-edit` tells Mod+Z whether the text is committed. `size` changes the font and the padding; `ref` receives the `textarea` element, and its native attributes pass through except `rows` and `cols`.",
  },
  ru: {
    pageTitle: 'TextArea',
    pageDescription:
      'Многострочное поле текста: растёт вместе с текстом и фиксирует значение по Ctrl+Enter.',
    editingTitle: 'Редактирование нескольких строк',
    editingText:
      'Многострочное поле работает как [TextField](components/text-field): значение управляемое, изменения приходят через `onValueChange(value, phase)`, а `updateMode="live"` даёт предпросмотр на каждый ввод. Отличаются клавиши: Enter переносит строку, а Ctrl+Enter (⌘+Enter на macOS) фиксирует значение и оставляет фокус в поле. Уход из поля тоже фиксирует, а Esc отбрасывает набранный текст и выходит из поля.',
    editingText2:
      'Поле растёт вместе с текстом от `minRows` (по умолчанию 2) до `maxRows` (по умолчанию 8), дальше появляется прокрутка. Высота следит и за шириной: в узкой панели текст переносится на большее число строк. Менять размер поля вручную нельзя.',
    statesTitle: 'Некорректное, смешанное и только чтение',
    statesText:
      '`validate` отмечает некорректный текст рамкой ошибки и пузырём с сообщением, как у текстового поля, и некорректный текст не фиксируется: очистите первое поле, чтобы это увидеть. `mixed` показывает черту, когда у нескольких объектов разные заметки. Поле только для чтения остаётся в порядке Tab, текст в нём можно выделить и скопировать; отключённое выпадает из порядка Tab.',
    keyboardOtherTitle: 'Клавиатура и остальные пропсы',
    keyboardOtherText:
      'Tab уходит из поля, поэтому символ табуляции не вводится. Ctrl+Z до фиксации — родная отмена браузера. Esc, который отбросил набранный текст, не закрывает диалог, всплывающую панель или меню вокруг поля. Поле построено на той же основе, что и текстовое, поэтому `data-value-edit` подсказывает Mod+Z, зафиксирован ли текст. `size` меняет шрифт и отступы; `ref` получает элемент `textarea`, а его нативные атрибуты передаются дальше, кроме `rows` и `cols`.',
  },
});
