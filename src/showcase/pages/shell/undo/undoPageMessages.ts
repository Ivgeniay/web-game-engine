import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const undoPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Undo stack',
    pageDescription:
      'Operations from the integration, one entry per edit of a field, grouping and Mod+Z in fields.',
    undoStackTitle: 'Undo stack and operations',
    undoStackText:
      'The undo stack is `undo` in the editor registries. The framework does not know how the engine changes its data, so the stack keeps operations that the integration gives it: `UndoOperation` from `@/contracts/undo` with a `label` (a `MessageRef`), `undo` and `redo`. The change is already done when the operation is pushed: `undo.push(operation)` records it and drops the redo branch. `undo()`, `redo()`, `canUndo()`, `canRedo()`, `peekUndo()`, `clear()` and `subscribe()` are the rest of the API. The stack keeps the latest 200 operations, and operations pushed while undoing or redoing are ignored.',
    fieldsUndoTitle: 'Fields and the undo stack',
    fieldsUndoText:
      "`useUndoableValue({ label, read, write })` from `@/state/undo` turns the value change protocol into undo entries. Pass the handler it returns to a field and to the drag of its caption. A preview writes the value and remembers where the change started, a commit writes the value and records one entry from the start to the end, a cancel writes the start value back and records nothing. A commit that ends at the start value records nothing either. Arrays are compared item by item; pass `equals` for other values. For a checkbox or a select, call the handler with `'commit'`. Outside React, `createUndoableValue` from `@/core/undo/undoableValue` does the same.",
    fieldsUndoText2:
      'The framework commands `undoCommand` and `redoCommand` from `@/core/undo/undoCommands` run the stack and are disabled when there is nothing to undo or redo. `EditorFrame` registers their handlers; the integration puts them into its Edit menu. Outside the frame, as below, register them with `registerUndoCommands(commands, undo)`.',
    modZTitle: 'Mod+Z in fields',
    modZText:
      "The commands have Mod+Z and Mod+Shift+Z with `allowInTextInput: 'whenCommitted'`. A text and a number field mark their input with `data-value-edit`: while the typed text differs from the committed value, the shortcut is left to the browser and undoes the typing; once the text is committed or typed back, the shortcut undoes the last change in the editor. Other text inputs, such as a search field, always keep the browser's undo. The example above has no hotkey controller, so try the shortcuts in the demo scene.",
    groupingTitle: 'Grouping',
    groupingText:
      '`undo.group(label, run)` records every operation pushed inside `run` as one entry, for example a change of several selected objects. Undo goes through the operations in reverse order. Groups inside a group join the outer one, and an empty group records nothing. The example uses a stack of its own, made by `createUndoStack`.',
  },
  ru: {
    pageTitle: 'Стек отмены',
    pageDescription:
      'Операции интеграции, одна запись на одно редактирование поля, группировка и Mod+Z в полях.',
    undoStackTitle: 'Стек отмены и операции',
    undoStackText:
      'Стек отмены — это `undo` в реестрах редактора. Каркас не знает, как движок меняет свои данные, поэтому стек хранит операции, которые даёт ему интеграция: `UndoOperation` из `@/contracts/undo` с подписью `label` (это `MessageRef`), `undo` и `redo`. Изменение к моменту записи уже сделано: `undo.push(operation)` записывает операцию и отбрасывает ветку повтора. `undo()`, `redo()`, `canUndo()`, `canRedo()`, `peekUndo()`, `clear()` и `subscribe()` — остальной API. Стек хранит последние 200 операций, а операции, добавленные во время отмены или повтора, игнорируются.',
    fieldsUndoTitle: 'Поля и стек отмены',
    fieldsUndoText:
      "`useUndoableValue({ label, read, write })` из `@/state/undo` превращает протокол изменения значения в записи отмены. Передайте обработчик, который он возвращает, полю и перетаскиванию его подписи. Предпросмотр записывает значение и запоминает, откуда началось изменение, фиксация записывает значение и создаёт одну запись от начала до конца, отмена возвращает начальное значение и ничего не записывает. Фиксация, которая закончилась на начальном значении, тоже ничего не записывает. Массивы сравниваются поэлементно; для других значений передайте `equals`. Для флажка или списка выбора вызывайте обработчик с `'commit'`. Вне React то же делает `createUndoableValue` из `@/core/undo/undoableValue`.",
    fieldsUndoText2:
      'Команды каркаса `undoCommand` и `redoCommand` из `@/core/undo/undoCommands` работают со стеком и отключены, когда отменять или повторять нечего. Их обработчики регистрирует `EditorFrame`, а интеграция ставит их в своё меню Edit. Вне каркаса страницы, как ниже, регистрируйте их через `registerUndoCommands(commands, undo)`.',
    modZTitle: 'Mod+Z в полях',
    modZText:
      "У команд сочетания Mod+Z и Mod+Shift+Z с `allowInTextInput: 'whenCommitted'`. Текстовое и числовое поля помечают свой ввод атрибутом `data-value-edit`: пока набранный текст отличается от зафиксированного значения, сочетание остаётся браузеру и отменяет набор; когда текст зафиксирован или набран обратно, сочетание отменяет последнее изменение в редакторе. Другие текстовые поля, например поле поиска, всегда оставляют отмену браузера. У примера выше нет контроллера горячих клавиш, поэтому сочетания пробуйте в демо-сцене.",
    groupingTitle: 'Группировка',
    groupingText:
      '`undo.group(label, run)` записывает все операции, добавленные внутри `run`, одной записью — например, изменение нескольких выбранных объектов. Отмена проходит операции в обратном порядке. Группы внутри группы сливаются с внешней, а пустая группа ничего не записывает. Пример использует собственный стек, созданный через `createUndoStack`.',
  },
});
