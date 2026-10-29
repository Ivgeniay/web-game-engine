import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const valueDragPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Value drag',
    pageDescription:
      'A hook that changes a number by dragging, with modifiers and an optional pointer lock.',
    draggingNumberTitle: 'Dragging a number',
    draggingNumberText:
      '`useValueDrag(target, disabled)` from `@/ui/valueDrag` turns any element into a zone that changes a number by dragging left and right, like the caption of a numeric field in Unity. Spread `zoneProps` on the element: they add the two-way arrow cursor, the pointer handlers and a click guard. `dragging` tells whether a drag is running. Property rows use the hook for their captions, and vector fields for their axis captions.',
    draggingNumberText2:
      'The target describes the number: `value`, `onValueChange`, `kind`, `min`, `max` and `step`, as in the number field. Every pixel moves the value by one step. With Shift the step is ten times finer, with Alt ten times coarser, and a modifier pressed in the middle of a drag affects only the movement after it. Pushing past a limit does not pile up: moving back changes the value at once.',
    protocolThresholdTitle: 'Protocol, threshold and cancel',
    protocolThresholdText:
      'A drag follows the value change protocol: `preview` while the pointer moves, one `commit` on release, so an undo stack records one entry per drag, and `cancel` with the value from the start of the drag on Esc. The drag starts only after the pointer moves a few pixels, so a click on a caption changes nothing and still focuses its field; after a real drag the click is swallowed. Pressing the zone first ends an unfinished edit in a focused text field, so the drag starts from the committed value.',
    infiniteDragTitle: 'Infinite drag',
    infiniteDragText:
      'By default the drag captures the pointer with `setPointerCapture` and stops growing at the edge of the screen. `infinite: true` locks the pointer with the Pointer Lock API instead: the cursor hides and the drag goes on past the screen edge, as in Unity. Browsers show a notice about the hidden cursor every time the lock starts, which is why the option is off by default. While the pointer is locked, the browser keeps Esc to itself and releases the lock, and the drag treats the release as a cancel.',
  },
  ru: {
    pageTitle: 'Перетаскивание значения',
    pageDescription:
      'Хук, который меняет число перетаскиванием, с модификаторами и необязательным захватом указателя.',
    draggingNumberTitle: 'Перетаскивание числа',
    draggingNumberText:
      '`useValueDrag(target, disabled)` из `@/ui/valueDrag` превращает любой элемент в зону, которая меняет число перетаскиванием влево и вправо, как подпись числового поля в Unity. Разверните `zoneProps` на элементе: они добавляют курсор с двусторонней стрелкой, обработчики указателя и защиту от клика. `dragging` говорит, идёт ли перетаскивание. Строки свойств используют хук для своих подписей, а поля векторов — для подписей осей.',
    draggingNumberText2:
      'Цель описывает число: `value`, `onValueChange`, `kind`, `min`, `max` и `step`, как у числового поля. Каждый пиксель сдвигает значение на один шаг. С Shift шаг в десять раз мельче, с Alt — в десять раз крупнее, и модификатор, нажатый посреди перетаскивания, влияет только на движение после нажатия. Упор в границу не накапливается: обратное движение сразу меняет значение.',
    protocolThresholdTitle: 'Протокол, порог и отмена',
    protocolThresholdText:
      'Перетаскивание следует протоколу изменения значения: `preview`, пока указатель движется, один `commit` при отпускании — поэтому стек отмены записывает одну запись на перетаскивание, — и `cancel` со значением на начало перетаскивания по Esc. Перетаскивание начинается, только когда указатель сдвинулся на несколько пикселей, поэтому клик по подписи ничего не меняет и по-прежнему переводит фокус в её поле; после настоящего перетаскивания клик гасится. Нажатие на зону сначала завершает незаконченную правку в текстовом поле с фокусом, поэтому перетаскивание начинается с зафиксированного значения.',
    infiniteDragTitle: 'Бесконечное перетаскивание',
    infiniteDragText:
      'По умолчанию перетаскивание захватывает указатель через `setPointerCapture` и перестаёт расти у края экрана. `infinite: true` вместо этого блокирует указатель через Pointer Lock API: курсор скрывается, и перетаскивание продолжается за краем экрана, как в Unity. Браузеры при каждом захвате показывают плашку о скрытом курсоре, поэтому опция по умолчанию выключена. Пока указатель заблокирован, браузер оставляет Esc себе и снимает блокировку, а перетаскивание считает это отменой.',
  },
});
