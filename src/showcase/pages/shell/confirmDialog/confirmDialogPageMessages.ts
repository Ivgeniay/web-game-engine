import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const confirmDialogPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Confirm dialog',
    pageDescription: 'Asking the user from code and getting the answer as a promise, with a queue.',
    askingCodeTitle: 'Asking from code',
    askingCodeText:
      "`editor.dialogs.confirm(options)` shows a confirm dialog and returns a `Promise` with the answer: `'confirm'` or `'cancel'`. A command awaits it in its `run`. There is no dialog markup at the call site: `ConfirmDialogHost`, which the editor frame already contains, shows the requests.",
    askingCodeItem:
      '`title`, `message`, `confirmLabel` and `cancelLabel` are `MessageRef`. Without `cancelLabel` the button says Cancel.',
    askingCodeItem2:
      "The confirm button is the main action on the right, and Enter chooses it. Escape and the cancel button answer `'cancel'`.",
    askingCodeItem3:
      'With `destructive: true` the focus starts on the cancel button, so a hasty Enter keeps the data.',
    askingCodeItem4:
      'A command run from a menu opens the dialog after the menu has closed and returned the focus, so the focus stays in the dialog.',
    queueTitle: 'Queue',
    queueText:
      'Requests wait in a queue: the second dialog appears only after the first one is answered. In the example, closing the project asks two questions at once and gets both answers in order.',
  },
  ru: {
    pageTitle: 'Диалог подтверждения',
    pageDescription: 'Вопрос пользователю из кода с ответом в виде промиса и очередью вопросов.',
    askingCodeTitle: 'Вопрос из кода',
    askingCodeText:
      "`editor.dialogs.confirm(options)` показывает диалог подтверждения и возвращает `Promise` с ответом: `'confirm'` или `'cancel'`. Команда ждёт его в своём `run`. Разметки диалога в месте вызова нет: запросы показывает `ConfirmDialogHost`, который уже есть в каркасе страницы редактора.",
    askingCodeItem:
      '`title`, `message`, `confirmLabel` и `cancelLabel` — это `MessageRef`. Без `cancelLabel` на кнопке написано «Отмена».',
    askingCodeItem2:
      "Кнопка подтверждения — главное действие справа, Enter выбирает её. Escape и кнопка отмены отвечают `'cancel'`.",
    askingCodeItem3:
      'С `destructive: true` фокус начинается на кнопке отмены, чтобы поспешный Enter сохранил данные.',
    askingCodeItem4:
      'Команда, запущенная из меню, открывает диалог после того, как меню закрылось и вернуло фокус, поэтому фокус остаётся в диалоге.',
    queueTitle: 'Очередь',
    queueText:
      'Запросы ждут в очереди: второй диалог появляется только после ответа на первый. В примере закрытие проекта задаёт два вопроса сразу и получает оба ответа по порядку.',
  },
});
