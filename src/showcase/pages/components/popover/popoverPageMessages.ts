import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const popoverPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Popover',
    pageDescription: 'A floating panel with any content next to its trigger.',
    panelAtTitle: 'A panel at a button',
    panelAtText:
      '`Popover` shows any content in a floating panel next to its trigger, below it or above it when there is no room, and shrinks its height to fit the screen. The `trigger` function receives the props of the button that opens the panel; `label` names the panel for screen readers. `className` goes to the panel and lays out its content.',
    panelAtText2:
      'When the panel opens, the focus moves to its first control. Esc, a click outside and moving the focus out of the panel close it, and the focus returns to the trigger. Popups opened from inside the panel, like the list of the select in the example, count as part of it: working with them does not close the panel, and Esc closes only the topmost one.',
    controlOutsideTitle: 'Control from outside',
    controlOutsideText:
      'By default the panel keeps its open state itself. Pass `open` and `onOpenChange` to decide it from outside; `onOpenChange` also works alone, as a notification. Its second argument tells why the panel opens or closes: `escape`, `outside` (a click outside, leaving the panel with the focus, the anchor going out of view) or `trigger`. [ColorField](components/color-field) cancels the choice on `escape` and commits it otherwise.',
  },
  ru: {
    pageTitle: 'Popover',
    pageDescription: 'Всплывающая панель с любым содержимым рядом со своим триггером.',
    panelAtTitle: 'Панель у кнопки',
    panelAtText:
      '`Popover` показывает любое содержимое во всплывающей панели рядом со своим триггером — под ним или над ним, если места нет, — и уменьшает высоту, чтобы поместиться на экране. Функция `trigger` получает пропсы кнопки, которая открывает панель; `label` называет панель для скринридеров. `className` уходит на панель и раскладывает её содержимое.',
    panelAtText2:
      'Когда панель открывается, фокус переходит на её первый элемент. Esc, клик снаружи и уход фокуса из панели закрывают её, и фокус возвращается на триггер. Всплывающие элементы, открытые изнутри панели, как список выбора в примере, считаются её частью: работа с ними не закрывает панель, а Esc закрывает только верхний из них.',
    controlOutsideTitle: 'Управление снаружи',
    controlOutsideText:
      'По умолчанию панель сама хранит, открыта ли она. Передайте `open` и `onOpenChange`, чтобы решать это снаружи; `onOpenChange` работает и сам по себе, как уведомление. Второй аргумент говорит, почему панель открылась или закрылась: `escape`, `outside` (клик снаружи, уход фокуса из панели, якорь вышел из видимой области) или `trigger`. [ColorField](components/color-field) по `escape` отменяет выбор, а в остальных случаях фиксирует его.',
  },
});
