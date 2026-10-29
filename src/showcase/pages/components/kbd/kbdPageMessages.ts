import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const kbdPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Kbd',
    pageDescription: 'A keyboard shortcut shown as text.',
    showingShortcutTitle: 'Showing a shortcut',
    showingShortcutText:
      '`Kbd` shows a keyboard shortcut in a `kbd` element, in the secondary text color, the way menus show shortcuts. It only displays a ready string and never receives the focus.',
    showingShortcutText2:
      'The string itself depends on the platform: macOS uses the ⌘ ⇧ ⌥ ⌃ symbols, other platforms write `Ctrl+Shift+S`. In the editor the string comes from `formatShortcut` or the `useFormatShortcut` hook, which build it from the shortcut of a command for the current platform. The example passes ready strings to show both platforms side by side.',
  },
  ru: {
    pageTitle: 'Kbd',
    pageDescription: 'Сочетание клавиш, показанное текстом.',
    showingShortcutTitle: 'Показ сочетания клавиш',
    showingShortcutText:
      '`Kbd` показывает сочетание клавиш в элементе `kbd` вторичным цветом текста, как сочетания в меню. Он только отображает готовую строку и никогда не получает фокус.',
    showingShortcutText2:
      'Сама строка зависит от платформы: на macOS это символы ⌘ ⇧ ⌥ ⌃, на других платформах пишут `Ctrl+Shift+S`. В редакторе строку даёт `formatShortcut` или хук `useFormatShortcut`: они строят её из сочетания команды для текущей платформы. Пример передаёт готовые строки, чтобы показать обе платформы рядом.',
  },
});
