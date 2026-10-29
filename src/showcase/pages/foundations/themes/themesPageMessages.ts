import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const themesPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Themes',
    pageDescription:
      'Theme modes, reading and changing the theme from code, and styling components with tokens.',
    modesTitle: 'Theme modes',
    modesIntro: 'The editor has three theme modes:',
    modesDark: '`dark` is the default;',
    modesLight: '`light`;',
    modesSystem: '`system` follows the operating system preference and updates when it changes.',
    modesStorage:
      'The mode is stored in `localStorage` under the `editor-theme-mode` key. The resolved theme, `dark` or `light`, is written to the `data-theme` attribute of the root element. An inline script in the HTML file sets it before the first paint, and `startThemeController(stores.theme)` keeps it in sync afterwards. The editor and the showcase entry points already call it.',
    readingTitle: 'Reading the current theme',
    readingStore:
      'Read the theme with `useThemeStore` and a selector. `mode` is what the user picked, `resolvedTheme` is the theme actually shown. With the `system` mode they differ.',
    readingRarelyNeeded:
      'Most components never need this: differences between themes belong in token values, not in component code.',
    changingTitle: 'Changing the mode',
    changingSetMode:
      'Call `setMode` from the store. It saves the mode, resolves the theme and starts or stops following the system preference. `THEME_MODES` lists every mode.',
    changingStores:
      'There is no global theme store. The entry point creates the stores with `createBrowserStores()` and passes them to `StoresProvider`, where `useThemeStore` finds them. Code outside React receives the store as a parameter: `getState()` reads the state and `subscribe()` listens to changes.',
    tokensTitle: 'Styling with tokens',
    tokensIntro:
      'Components are styled with CSS Modules. Colors, spacing, font sizes, radii, shadows and z-index values come only from token variables through `var()`. Components know nothing about the current theme: switching it changes token values, and every component follows.',
    tokensNaming:
      'Tokens are named by role, not by value, and grouped by prefix: `--color-`, `--space-`, `--font-`, `--size-`, `--radius-`, `--shadow-`, `--z-`, `--duration-`, `--easing-`.',
    tokensStatus:
      'Status colors `--color-status-*` are for icons, borders and indicators only. Text always uses `--color-text-*`.',
  },
  ru: {
    pageTitle: 'Темы',
    pageDescription: 'Режимы темы, чтение и смена темы из кода, оформление компонентов токенами.',
    modesTitle: 'Режимы темы',
    modesIntro: 'У редактора три режима темы:',
    modesDark: '`dark` — по умолчанию;',
    modesLight: '`light`;',
    modesSystem: '`system` следует настройке операционной системы и меняется вместе с ней.',
    modesStorage:
      'Режим хранится в `localStorage` под ключом `editor-theme-mode`. Итоговая тема, `dark` или `light`, записывается в атрибут `data-theme` корневого элемента. Встроенный скрипт в HTML-файле ставит его до первой отрисовки, а дальше его поддерживает `startThemeController(stores.theme)`. Точки входа редактора и витрины уже вызывают его.',
    readingTitle: 'Чтение текущей темы',
    readingStore:
      'Тема читается через `useThemeStore` с селектором. `mode` — то, что выбрал пользователь, `resolvedTheme` — тема, которая показана на самом деле. В режиме `system` они различаются.',
    readingRarelyNeeded:
      'Большинству компонентов это не нужно: различия тем живут в значениях токенов, а не в коде компонентов.',
    changingTitle: 'Смена режима',
    changingSetMode:
      'Вызовите `setMode` из стора. Он сохраняет режим, вычисляет тему и начинает или прекращает следить за настройкой системы. Все режимы перечислены в `THEME_MODES`.',
    changingStores:
      'Глобального стора темы нет. Точка входа создаёт сторы через `createBrowserStores()` и передаёт их в `StoresProvider`, где их находит `useThemeStore`. Код вне React получает стор параметром: `getState()` читает состояние, `subscribe()` подписывается на изменения.',
    tokensTitle: 'Оформление токенами',
    tokensIntro:
      'Компоненты оформляются через CSS Modules. Цвета, отступы, размеры шрифта, скругления, тени и z-index берутся только из переменных-токенов через `var()`. Компоненты ничего не знают о текущей теме: при её смене меняются значения токенов, и все компоненты следуют за ними.',
    tokensNaming:
      'Токены названы по роли, а не по значению, и сгруппированы по префиксам: `--color-`, `--space-`, `--font-`, `--size-`, `--radius-`, `--shadow-`, `--z-`, `--duration-`, `--easing-`.',
    tokensStatus:
      'Статусные цвета `--color-status-*` — только для иконок, рамок и индикаторов. Текст всегда пишется цветами `--color-text-*`.',
  },
});
