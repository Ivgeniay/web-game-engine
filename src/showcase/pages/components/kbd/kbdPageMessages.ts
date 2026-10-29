import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const kbdPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Kbd',
    pageDescription: 'A keyboard shortcut shown as text.',
    showingShortcutTitle: 'Showing a shortcut',
    showingShortcutText:
      '`Kbd` shows a keyboard shortcut in a `kbd` element, in the secondary text color, the way menus show shortcuts. It only displays a ready string and never receives the focus.',
    showingShortcutText2:
      'The string itself depends on the platform: macOS uses the ⌘ ⇧ ⌥ ⌃ symbols, other platforms write `Ctrl+Shift+S`. The shortcut mechanism of the editor will build that string from a command; until then the example passes ready strings for both platforms.',
  },
  ru: {
    pageTitle: 'Kbd',
    pageDescription: 'Сочетание клавиш, показанное текстом.',
    showingShortcutTitle: 'Показ сочетания клавиш',
    showingShortcutText:
      '`Kbd` показывает сочетание клавиш в элементе `kbd` вторичным цветом текста, как сочетания в меню. Он только отображает готовую строку и никогда не получает фокус.',
    showingShortcutText2:
      'Сама строка зависит от платформы: на macOS это символы ⌘ ⇧ ⌥ ⌃, на других платформах пишут `Ctrl+Shift+S`. Механизм сочетаний редактора будет строить эту строку из команды; пока пример передаёт готовые строки для обеих платформ.',
  },
});
