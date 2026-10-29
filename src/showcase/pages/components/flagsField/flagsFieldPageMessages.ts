import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const flagsFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'FlagsField',
    pageDescription: 'A set of flags picked from a list that stays open while you toggle.',
    choosingTitle: 'Choosing flags',
    choosingText:
      'A flags field edits a set of string flags, such as layers of a culling mask or axes to freeze. `options` lists the flags with their captions, and `value` holds the flags that are on. The field shows a summary: `noneLabel` when no flag is on, `allLabel` when every flag is on, otherwise the names of the flags that are on, separated by commas and cut with an ellipsis when they do not fit. All captions come ready from the owner, because the field does not translate.',
    choosingText2:
      'The list is a [Menu](components/menu) with checkbox items, and it does not close when a flag is toggled. The first two items set nothing or everything; a disabled flag keeps its state. Every toggle is one commit through `onValueChange(change, phase)`, so it makes one undo entry. The change is `{ on, mixed }`: for a single object `change.on` is the new set.',
    mixedTitle: 'Several objects',
    mixedText:
      '`mixedFlags` lists the flags that differ between the selected objects. Their items show a dash and `aria-checked="mixed"`, and the field shows `mixedLabel`. Toggling a mixed flag turns it on or off for every object.',
    mixedText2:
      'A mixed flag that was not touched stays in `change.mixed`, so the owner keeps the own state of each object for it. `applyFlagsChange(current, change, options)` from `@/ui/flagsField/flagsValue` applies a change to the flags of one object.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'Enter, Space and Alt+ArrowDown open the list on the first item. The arrows move between items, Enter and Space toggle the active item without closing the list, and Esc closes it and returns the focus to the field without a change. In a `PropertyRow` give the field `id` and `aria-labelledby` from the row. `size`, `disabled`, `ref` and `className` work as in a [Select](components/select).',
  },
  ru: {
    pageTitle: 'FlagsField',
    pageDescription: 'Набор флагов из списка, который не закрывается, пока флаги переключают.',
    choosingTitle: 'Выбор флагов',
    choosingText:
      'Поле флагов редактирует набор строковых флагов, например слои маски отсечения или оси заморозки. `options` перечисляет флаги с подписями, а `value` хранит включённые флаги. Поле показывает сводку: `noneLabel`, когда ни один флаг не включён, `allLabel`, когда включены все, иначе имена включённых флагов через запятую с многоточием, если они не помещаются. Все подписи приходят готовыми от владельца, потому что поле не переводит.',
    choosingText2:
      'Список — это [Menu](components/menu) с пунктами-флажками, и он не закрывается при переключении флага. Первые два пункта выключают или включают всё; отключённый флаг сохраняет своё состояние. Каждое переключение — одна фиксация через `onValueChange(change, phase)`, поэтому оно даёт одну запись отмены. Изменение — это `{ on, mixed }`: для одного объекта `change.on` — новый набор.',
    mixedTitle: 'Несколько объектов',
    mixedText:
      '`mixedFlags` перечисляет флаги, которые различаются у выбранных объектов. Их пункты показывают черту и `aria-checked="mixed"`, а поле показывает `mixedLabel`. Переключение смешанного флага включает или выключает его у всех объектов.',
    mixedText2:
      'Смешанный флаг, который не трогали, остаётся в `change.mixed`, поэтому владелец сохраняет для него состояние каждого объекта. `applyFlagsChange(current, change, options)` из `@/ui/flagsField/flagsValue` применяет изменение к флагам одного объекта.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Enter, пробел и Alt+стрелка вниз открывают список на первом пункте. Стрелки переходят между пунктами, Enter и пробел переключают активный пункт, не закрывая список, а Esc закрывает его и возвращает фокус на поле без изменений. В `PropertyRow` передайте полю `id` и `aria-labelledby` из строки. `size`, `disabled`, `ref` и `className` работают как у [Select](components/select).',
  },
});
