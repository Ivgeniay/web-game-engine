import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const listEditorPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ListEditor',
    pageDescription: 'An editable array in the inspector: add, remove and reorder elements.',
    editingTitle: 'Editing an array',
    editingText:
      'A list editor shows an array as a collapsible section with its size on the right, as in the Unity inspector. Every element is a row with a handle, the element itself and a remove button; the button at the bottom adds an element at the end. The owner draws an element with `renderItem({ item, index, label, disabled, onItemChange })`, usually a [PropertyRow](components/property-row) with a field, and creates a new one with `createItem()`.',
    editingText2:
      'The value is the whole array, and every change sends the new array through `onValueChange(value, phase)`. Adding, removing, moving and resizing are commits, so each of them makes one undo entry. An edit of an element keeps the phase of its field: a drag of a vector component previews and then commits once. Typing a larger size adds copies of the last element, a smaller size drops elements from the end.',
    editingText3:
      'The section is controlled through `expanded` and `onExpandedChange`. Without `getItemKey(item, index)` the rows are keyed by index; give stable keys when the elements have them, so a field keeps its draft while the rows move. All captions come in `labels`: `useListEditorLabels()` from `@/state/fields` gives them translated.',
    reorderTitle: 'Reordering',
    reorderText:
      'Drag a row by its handle; a line shows where it will land, and Esc cancels the drag. From the keyboard Alt+ArrowUp and Alt+ArrowDown on a handle move its element and keep the focus on it. After a removal the focus goes to the next remove button or to the add button. Dragging uses the drag and drop mechanism, so the page needs a `DragAndDropLayer`; the data type is unique to each list, and a row never lands in another list.',
    mixedTitle: 'Mixed and disabled',
    mixedText:
      'When the selected objects have different arrays, `mixed` shows a dash as the size and turns editing off: arrays of different length cannot be edited together. `disabled` turns off every control of the list.',
  },
  ru: {
    pageTitle: 'ListEditor',
    pageDescription: 'Редактируемый массив в инспекторе: добавить, удалить и переставить элементы.',
    editingTitle: 'Редактирование массива',
    editingText:
      'Редактор списка показывает массив сворачиваемой секцией с размером справа, как в инспекторе Unity. Каждый элемент — строка с ручкой, самим элементом и кнопкой удаления; кнопка внизу добавляет элемент в конец. Элемент рисует владелец через `renderItem({ item, index, label, disabled, onItemChange })`, обычно это [PropertyRow](components/property-row) с полем, а новый элемент создаёт `createItem()`.',
    editingText2:
      'Значение — весь массив, и каждое изменение отправляет новый массив через `onValueChange(value, phase)`. Добавление, удаление, перестановка и смена размера — фиксации, поэтому каждая даёт одну запись отмены. Правка элемента сохраняет фазу его поля: перетаскивание компоненты вектора даёт предпросмотр и затем одну фиксацию. Если ввести больший размер, добавятся копии последнего элемента, если меньший — элементы с конца удалятся.',
    editingText3:
      'Секция управляемая через `expanded` и `onExpandedChange`. Без `getItemKey(item, index)` строки получают ключи по индексу; передайте устойчивые ключи, если они есть у элементов, чтобы поле сохраняло черновик, пока строки переставляются. Все подписи приходят в `labels`: `useListEditorLabels()` из `@/state/fields` даёт их переведёнными.',
    reorderTitle: 'Перестановка',
    reorderText:
      'Перетащите строку за ручку; линия показывает, куда она встанет, а Esc отменяет перетаскивание. С клавиатуры Alt+стрелка вверх и Alt+стрелка вниз на ручке переставляют её элемент и оставляют фокус на ней. После удаления фокус переходит на следующую кнопку удаления или на кнопку добавления. Перетаскивание идёт через механизм переноса данных, поэтому странице нужен `DragAndDropLayer`; тип данных у каждого списка свой, и строка не попадёт в чужой список.',
    mixedTitle: 'Смешанное и отключённое',
    mixedText:
      'Когда у выбранных объектов разные массивы, `mixed` показывает черту вместо размера и выключает правку: массивы разной длины нельзя редактировать вместе. `disabled` отключает все элементы управления списка.',
  },
});
