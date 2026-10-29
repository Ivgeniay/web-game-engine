import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const thumbnailPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Thumbnail',
    pageDescription: 'A preview image loaded by the integration, with an icon until it is ready.',
    loadingTitle: 'Loading a preview',
    loadingText:
      '`Thumbnail` shows the preview of the item `id`. The integration gives a `load` function of the `ThumbnailLoader` type from `@/contracts/thumbnail`: it gets the `id` and an `AbortSignal` and returns the address of an image, for example an object URL or a data URL built by the engine. Until the address arrives, and when the load fails, the `placeholder` icon is shown. There is no loading indicator yet.',
    loadingText2:
      'The load is cancelled when the item changes or the thumbnail goes away: stop the work of the engine on `signal`. Keep `load` the same between renders, a new function starts a new load. Caching is the job of the integration. An image with a known address is passed in `src` and is not loaded.',
    layoutTitle: 'Size and accessibility',
    layoutText:
      'The thumbnail fills the box that its parent gives it through `className` and fits the image inside without cropping. It is decorative and hidden from assistive technology: the caption of the cell or the field names the item. It does not take the focus. In the example the loader of the integration draws a shape of its own color for each texture: the sun loads quickly, the grass slowly, and the load of the water fails on purpose, so its icon stays. The caption under each thumbnail shows the state that the example tracks in its loader.',
  },
  ru: {
    pageTitle: 'Thumbnail',
    pageDescription: 'Превью, которое загружает интеграция, с иконкой до готовности.',
    loadingTitle: 'Загрузка превью',
    loadingText:
      '`Thumbnail` показывает превью элемента `id`. Интеграция передаёт функцию `load` типа `ThumbnailLoader` из `@/contracts/thumbnail`: она получает `id` и `AbortSignal` и возвращает адрес изображения, например object URL или data URL, построенный движком. Пока адреса нет и если загрузка не удалась, показывается иконка `placeholder`. Индикатора загрузки пока нет.',
    loadingText2:
      'Загрузка отменяется, когда элемент меняется или превью исчезает: остановите работу движка по `signal`. Держите `load` одной и той же между отрисовками: новая функция запускает новую загрузку. Кэш — забота интеграции. Изображение с известным адресом передаётся в `src` и не загружается.',
    layoutTitle: 'Размер и доступность',
    layoutText:
      'Превью заполняет рамку, которую ему даёт родитель через `className`, и вписывает изображение без обрезки. Оно декоративное и скрыто от вспомогательных технологий: элемент называет подпись ячейки или поля. Фокус оно не получает. В примере загрузчик интеграции рисует для каждой текстуры фигуру своего цвета: солнце загружается быстро, трава медленно, а загрузка воды намеренно завершается ошибкой, поэтому у неё остаётся иконка. Подпись под каждым превью показывает состояние, которое пример отслеживает в своём загрузчике.',
  },
});
