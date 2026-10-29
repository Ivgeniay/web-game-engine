import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const colorPickerPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ColorPicker',
    pageDescription: 'Choosing a color: a saturation area, hue and alpha strips, numbers and hex.',
    partsTitle: 'Parts of the picker',
    partsText:
      'A color picker edits a `Color` from `@/contracts/color`: the channels `r`, `g`, `b` and `a` from 0 to 1, as in Unity. An integration converts it to the format of its engine. The square sets saturation from left to right and brightness from bottom to top, the strips below it set the hue and the alpha over a checkerboard.',
    partsText2:
      'Under the strips a [Select](components/select) chooses the color model: RGB from 0 to 255, RGB from 0 to 1 or HSV. Each channel of the model is a [Slider](components/slider) with a number field, and the alpha channel comes last. The hex field takes 6 or 8 digits with or without `#` and shows 8 digits only for a translucent color. `showAlpha={false}` hides the alpha strip and field for colors without transparency.',
    partsText3:
      'The model is controlled through `colorMode` and `onColorModeChange`, so the owner can remember it; without them the picker keeps it itself. All captions come in `labels`: `useColorFieldLabels()` from `@/state/fields` gives them translated. The picker remembers the hue while the color passes through gray or black. Where the browser has the `EyeDropper` API, a button picks a color from the screen; elsewhere there is no button.',
    protocolTitle: 'Changes and undo',
    protocolText:
      'The picker follows the value change protocol: dragging in the square or on a strip sends previews and the release sends one commit, Esc during a drag cancels it, and a held arrow key sends previews and a commit when it is released. The number and hex fields commit on Enter and blur. The eyedropper commits at once.',
    protocolText2:
      'So a picker placed on a page makes an undo entry per drag. Inside a [ColorField](components/color-field) the whole choice becomes one entry: the field turns every change of the picker into a preview and commits once when the picker closes.',
    keyboardTitle: 'Keyboard and accessibility',
    keyboardText:
      'The square, the strips and the fields are in the usual Tab order. On the square the left and right arrows change saturation, the up and down arrows and PageUp and PageDown change brightness, and Home and End set the saturation to its edges; with Shift a step is ten times finer, with Alt ten times coarser. On a strip the arrows move by one degree of hue or one percent of alpha. The square is a `slider` with a role description and a text value with both coordinates. The gradients of the square and the strips are inline styles, because they are computed from the color.',
  },
  ru: {
    pageTitle: 'ColorPicker',
    pageDescription: 'Выбор цвета: поле насыщенности, полосы тона и альфа-канала, числа и HEX.',
    partsTitle: 'Части окна выбора цвета',
    partsText:
      'Окно выбора цвета редактирует `Color` из `@/contracts/color`: каналы `r`, `g`, `b` и `a` от 0 до 1, как в Unity. Интеграция переводит его в формат своего движка. Квадрат задаёт насыщенность слева направо и яркость снизу вверх, полосы под ним — тон и альфа-канал поверх шахматки.',
    partsText2:
      'Под полосами [Select](components/select) выбирает модель цвета: RGB от 0 до 255, RGB от 0 до 1 или HSV. Каждый канал модели — [Slider](components/slider) с числовым полем, альфа-канал идёт последним. Поле HEX принимает 6 или 8 цифр с `#` или без и показывает 8 цифр только для полупрозрачного цвета. `showAlpha={false}` прячет полосу и поле альфа-канала для цветов без прозрачности.',
    partsText3:
      'Модель управляемая через `colorMode` и `onColorModeChange`, чтобы владелец мог её запомнить; без них окно хранит её само. Все подписи приходят в `labels`: `useColorFieldLabels()` из `@/state/fields` даёт их переведёнными. Окно запоминает тон, пока цвет проходит через серый или чёрный. Где в браузере есть `EyeDropper` API, кнопка берёт цвет с экрана; в остальных браузерах кнопки нет.',
    protocolTitle: 'Изменения и отмена',
    protocolText:
      'Окно следует протоколу изменения значения: перетаскивание в квадрате или на полосе даёт предпросмотр, отпускание — одну фиксацию, Esc во время перетаскивания отменяет его, а удержание стрелки даёт предпросмотр и фиксацию, когда клавишу отпустили. Числовые поля и поле HEX фиксируют значение по Enter и потере фокуса. Пипетка фиксирует цвет сразу.',
    protocolText2:
      'Поэтому окно, поставленное прямо на страницу, даёт запись отмены на каждое перетаскивание. Внутри [ColorField](components/color-field) весь выбор становится одной записью: поле превращает каждое изменение окна в предпросмотр и фиксирует цвет один раз, когда окно закрывается.',
    keyboardTitle: 'Клавиатура и доступность',
    keyboardText:
      'Квадрат, полосы и поля стоят в обычном порядке Tab. В квадрате стрелки влево и вправо меняют насыщенность, стрелки вверх и вниз, PageUp и PageDown — яркость, а Home и End ставят насыщенность на края; с Shift шаг в десять раз мельче, с Alt — в десять раз крупнее. На полосе стрелки меняют тон на градус или альфа-канал на процент. Квадрат — `slider` с описанием роли и текстовым значением с обеими координатами. Градиенты квадрата и полос — инлайн-стили, потому что они вычисляются из цвета.',
  },
});
