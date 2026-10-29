import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const sliderPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Slider',
    pageDescription: 'A number in a range, picked with a thumb, with a number field on the right.',
    draggingTitle: 'Dragging and typing',
    draggingText:
      'A slider edits a `number` between the required `min` and `max`. The rail is on the left and a [NumberField](components/number-field) is on the right, as in the Unity inspector; both show the same value. Pressing the rail moves the thumb under the pointer at once, and dragging goes on from there.',
    draggingText2:
      'Changes follow the value change protocol: dragging sends previews, the release sends one commit, and Esc during a drag sends a cancel with the value from before the press. So one drag makes one undo entry. The field next to the slider commits on Enter or blur, as a number field does.',
    draggingText3:
      'A dragged float is rounded to what one pixel of the rail can show, so a wide slider gives finer values. `kind="integer"` keeps whole numbers. `precision` limits the shown decimal places in the field and in the announced value.',
    logMixedTitle: 'Logarithmic scale, mixed and disabled',
    logMixedText:
      '`scale="log"` spreads the range by orders of magnitude: from 0.1 to 1000, each tenfold takes the same part of the rail. A logarithmic slider needs a positive `min`; an empty range or a non-positive `min` throws an error.',
    logMixedText2:
      '`mixed` hides the thumb and shows a dash in the field; the first change is committed, so the owner applies it to every selected object. A read-only slider stays in the Tab order and ignores the pointer and keys. A disabled one leaves the Tab order.',
    keyboardTitle: 'Keyboard',
    keyboardText:
      'The slider and its field are two Tab stops. On the slider the arrows move by `step`, with Shift ten times finer and with Alt ten times coarser, PageUp and PageDown by ten steps, and Home and End go to the edges. On a logarithmic scale a step is a hundredth of the rail.',
    keyboardText2:
      'Holding a key sends a preview on every repeat and a commit when the key is released, so holding an arrow makes one undo entry. Esc while the key is held cancels back to the value from before the press. Inside a [Toolbar](components/toolbar) the slider is one roving stop.',
    keyboardText3:
      'The rail has the `slider` role with the value, the limits and the formatted value as text. Give it a name through `aria-label` or `aria-labelledby`; the field gets the same name. In a `PropertyRow`, `id` goes to the field, so a click on the caption focuses it. The rail is drawn with the `--size-slider-*` tokens.',
  },
  ru: {
    pageTitle: 'Slider',
    pageDescription: 'Число в диапазоне, выбираемое бегунком, с числовым полем справа.',
    draggingTitle: 'Перетаскивание и ввод',
    draggingText:
      'Ползунок редактирует `number` между обязательными `min` и `max`. Слева дорожка, справа [NumberField](components/number-field), как в инспекторе Unity; оба показывают одно значение. Нажатие на дорожку сразу ставит бегунок под указатель, и перетаскивание продолжается оттуда.',
    draggingText2:
      'Изменения идут по протоколу изменения значения: перетаскивание даёт предпросмотр, отпускание — одну фиксацию, а Esc во время перетаскивания — отмену со значением до нажатия. Поэтому одно перетаскивание даёт одну запись отмены. Поле рядом с ползунком фиксирует значение по Enter или потере фокуса, как числовое поле.',
    draggingText3:
      'Перетаскиваемое дробное число округляется до того, что может показать один пиксель дорожки, поэтому широкий ползунок даёт более точные значения. `kind="integer"` оставляет целые числа. `precision` ограничивает число знаков после запятой в поле и в объявляемом значении.',
    logMixedTitle: 'Логарифмическая шкала, смешанное и отключённое',
    logMixedText:
      '`scale="log"` раскладывает диапазон по порядкам: от 0,1 до 1000 каждое десятикратное увеличение занимает одинаковую часть дорожки. Логарифмическому ползунку нужен положительный `min`; пустой диапазон или неположительный `min` вызывают ошибку.',
    logMixedText2:
      '`mixed` прячет бегунок и показывает черту в поле; первое изменение фиксируется, чтобы владелец применил его ко всем выбранным объектам. Ползунок только для чтения остаётся в порядке Tab и не реагирует на указатель и клавиши. Отключённый выпадает из порядка Tab.',
    keyboardTitle: 'Клавиатура',
    keyboardText:
      'Ползунок и его поле — две остановки Tab. На ползунке стрелки меняют значение на `step`, с Shift в десять раз мельче, с Alt в десять раз крупнее, PageUp и PageDown — на десять шагов, Home и End ставят края. На логарифмической шкале шаг — сотая часть дорожки.',
    keyboardText2:
      'Удержание клавиши даёт предпросмотр на каждый повтор и фиксацию, когда клавишу отпустили, поэтому удержание стрелки даёт одну запись отмены. Esc при удержании клавиши отменяет изменение до значения перед нажатием. Внутри [Toolbar](components/toolbar) ползунок — одна остановка роумингового фокуса.',
    keyboardText3:
      'У дорожки роль `slider` со значением, границами и отформатированным значением текстом. Имя ей дают `aria-label` или `aria-labelledby`; поле получает то же имя. В `PropertyRow` `id` уходит полю, поэтому клик по подписи фокусирует его. Дорожка нарисована токенами `--size-slider-*`.',
  },
});
