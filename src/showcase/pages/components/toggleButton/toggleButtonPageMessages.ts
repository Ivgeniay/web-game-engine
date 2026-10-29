import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const toggleButtonPageMessages = defineDocMessages({
  en: {
    pageTitle: 'ToggleButton',
    pageDescription: 'A button that is switched on and off, with text or only an icon.',
    pressedStateTitle: 'Pressed state',
    pressedStateText:
      'A toggle button is on or off. The state is controlled: `pressed` sets it, and `onPressedChange` receives the requested new state when the button is clicked or pressed with Enter or Space. The pressed state is shown with the selection background, not only with a color of the text, and screen readers get it from `aria-pressed`.',
    pressedStateText2:
      '`variant` is `default` or `flat`; there is no accent toggle. `size` works as for `Button`.',
    iconOnlyTitle: 'Icon only',
    iconOnlyText:
      'Without text, pass `icon` and a required `label`. The label names the button for screen readers and is shown in a `Tooltip` on hover and on keyboard focus, as for `IconButton`. With text, `icon` is optional and shown before it.',
    disabledTitle: 'Disabled',
    disabledText:
      'A disabled toggle ignores the mouse and the keyboard and leaves the Tab order. A pressed disabled toggle keeps a dimmed selection background, so its state stays visible. With `focusableWhenDisabled` it stays reachable in a toolbar: see the [Toolbar](components/toolbar) page.',
    otherPropsTitle: 'Other props',
    otherPropsText:
      "`ref`, native attributes and `className` work as for `Button`, except `onClick`, `aria-pressed`, `aria-label` and `title`, which the toggle sets itself or replaces with a tooltip. Inside a toolbar or another roving focus group the toggle joins the group's arrow order.",
  },
  ru: {
    pageTitle: 'ToggleButton',
    pageDescription: 'Кнопка, которая включается и выключается, с текстом или только с иконкой.',
    pressedStateTitle: 'Нажатое состояние',
    pressedStateText:
      'Переключаемая кнопка включена или выключена. Состояние управляемое: `pressed` задаёт его, а `onPressedChange` получает запрошенное новое состояние при клике или нажатии Enter или пробела. Нажатое состояние показывается фоном выделения, а не только цветом текста, и скринридеры узнают его из `aria-pressed`.',
    pressedStateText2:
      '`variant` — `default` или `flat`; акцентной переключаемой кнопки нет. `size` работает как у `Button`.',
    iconOnlyTitle: 'Только иконка',
    iconOnlyText:
      'Без текста передайте `icon` и обязательный `label`. Подпись называет кнопку для скринридеров и показывается в `Tooltip` при наведении и фокусе с клавиатуры, как у `IconButton`. С текстом `icon` необязателен и показывается перед текстом.',
    disabledTitle: 'Отключённая кнопка',
    disabledText:
      'Отключённая переключаемая кнопка не реагирует на мышь и клавиатуру и выпадает из порядка Tab. Нажатая отключённая кнопка сохраняет приглушённый фон выделения, поэтому её состояние остаётся видно. С `focusableWhenDisabled` она остаётся доступной в панели инструментов: см. страницу [Toolbar](components/toolbar).',
    otherPropsTitle: 'Остальные пропсы',
    otherPropsText:
      '`ref`, нативные атрибуты и `className` работают как у `Button`, кроме `onClick`, `aria-pressed`, `aria-label` и `title`: их переключаемая кнопка задаёт сама или заменяет подсказкой. Внутри панели инструментов или другой группы с роуминговым фокусом кнопка встаёт в общий порядок стрелок группы.',
  },
});
