import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const rectFieldPageMessages = defineDocMessages({
  en: {
    pageTitle: 'RectField',
    pageDescription: 'A rectangle: position and size in two rows of a vector field.',
    positionSizeTitle: 'Position and size',
    positionSizeText:
      'A rect field edits a `Rect` from `@/contracts/geometry` with `x`, `y`, `width` and `height`. It shows two [VectorField](components/vector-field) rows, `X Y` and `W H`, and sends the whole rectangle with one component replaced, keeping the phase of the component. The axis letters are drag zones, as in a vector field, and the letters are not translated.',
    positionSizeText2:
      '`kind="integer"` gives a rectangle of whole numbers, like the rectangle of a sprite in pixels. `mixed` marks components that differ between objects, for example `{ width: true }`. The four components are four Tab stops from left to right and top to bottom. In a `PropertyRow` give the field `id` and `aria-labelledby` from the row; the components are then named by the row caption and their letter.',
  },
  ru: {
    pageTitle: 'RectField',
    pageDescription: 'Прямоугольник: положение и размер в двух строках векторного поля.',
    positionSizeTitle: 'Положение и размер',
    positionSizeText:
      'Поле прямоугольника редактирует `Rect` из `@/contracts/geometry` с `x`, `y`, `width` и `height`. Оно показывает две строки [VectorField](components/vector-field), `X Y` и `W H`, и отправляет весь прямоугольник с заменённой компонентой, сохраняя фазу компоненты. Буквы осей — зоны перетаскивания, как у векторного поля, и не переводятся.',
    positionSizeText2:
      '`kind="integer"` даёт прямоугольник из целых чисел, например прямоугольник спрайта в пикселях. `mixed` отмечает компоненты, которые различаются у объектов, например `{ width: true }`. Четыре компоненты — четыре остановки Tab слева направо и сверху вниз. В `PropertyRow` передайте полю `id` и `aria-labelledby` из строки; тогда компоненты называются подписью строки и своей буквой.',
  },
});
