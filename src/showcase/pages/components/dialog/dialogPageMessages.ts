import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const dialogPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Dialog',
    pageDescription: 'A modal window with a title, content and actions, above a dimmed editor.',
    modalWindowTitle: 'A modal window',
    modalWindowText:
      '`Dialog` shows a modal window above the editor and dims everything behind it with `--color-overlay-backdrop`. The owner decides whether it is open: `open` shows it, `onClose` asks to close it on Esc. A click on the dimmed area does not close a dialog.',
    modalWindowText2:
      '`title` is required: it is the heading and the name of the dialog for screen readers. `description` is an optional line below it. The content goes to `children`, the buttons to `actions`; they are aligned to the right, the main action last. `className` lays out the content.',
    modalWindowText3:
      'Popups opened inside a dialog appear above it: the list of the select and the hints of the icon buttons in the example. Esc closes only the topmost of them.',
    mainActionTitle: 'The main action and Enter',
    mainActionText:
      'The dialog is a form. Give the main action `type="submit"` and pass `onSubmit`: the main button and Enter both run it. Enter is left to buttons, lists, multi-line fields and to any field that handles it itself, so it runs the main action only from places where it has no other meaning. Without `onSubmit`, Enter does nothing.',
    mainActionText2:
      'When the dialog opens, the focus moves to its first control, usually the first field. A dialog without fields should start on its main action: pass a ref to that button as `initialFocus`, as the example does.',
    focusTitle: 'Focus',
    focusText:
      'Tab and Shift+Tab move only inside the dialog, and the rest of the editor is hidden from screen readers while it is open. After closing, the focus returns to the control that opened the dialog. A confirmation that code opens and awaits, `dialogs.confirm` from the editor registries, is built on top of this component.',
  },
  ru: {
    pageTitle: 'Dialog',
    pageDescription:
      'Модальное окно с заголовком, содержимым и действиями поверх затемнённого редактора.',
    modalWindowTitle: 'Модальное окно',
    modalWindowText:
      '`Dialog` показывает модальное окно поверх редактора и затемняет всё позади через `--color-overlay-backdrop`. Открыт ли он, решает владелец: `open` показывает его, `onClose` просит закрыть по Esc. Клик по затемнённой области диалог не закрывает.',
    modalWindowText2:
      '`title` обязателен: это заголовок и имя диалога для скринридеров. `description` — необязательная строка под ним. Содержимое идёт в `children`, кнопки — в `actions`; они выровнены вправо, главное действие последним. `className` раскладывает содержимое.',
    modalWindowText3:
      'Всплывающие элементы, открытые внутри диалога, появляются поверх него: список выбора и подсказки кнопок-иконок в примере. Esc закрывает только верхний из них.',
    mainActionTitle: 'Главное действие и Enter',
    mainActionText:
      'Диалог — это форма. Дайте главному действию `type="submit"` и передайте `onSubmit`: его запускают и главная кнопка, и Enter. Enter остаётся за кнопками, списками, многострочными полями и любым полем, которое обрабатывает его само, поэтому главное действие он запускает только оттуда, где у него нет другого смысла. Без `onSubmit` Enter ничего не делает.',
    mainActionText2:
      'Когда диалог открывается, фокус переходит на его первый элемент, обычно на первое поле. Диалог без полей должен начинаться с главного действия: передайте ref этой кнопки как `initialFocus`, как в примере.',
    focusTitle: 'Фокус',
    focusText:
      'Tab и Shift+Tab ходят только внутри диалога, а остальной редактор, пока диалог открыт, скрыт от скринридеров. После закрытия фокус возвращается на элемент, который открыл диалог. Подтверждение, которое код открывает и ждёт, — `dialogs.confirm` из реестров редактора — построено поверх этого компонента.',
  },
});
