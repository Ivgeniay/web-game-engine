# Глоссарий каркаса

Единые переводы терминов каркаса. Здесь только термины каркаса: термины движков ведут разработчики движков у себя.

Переводы терминов лежат в словаре `src/core/i18n/commonMessages.ts`. При изменении глоссария словарь меняется вместе с ним.

| English | Русский |
|---|---|
| Window | Окно |
| Panel | Панель |
| Tab | Вкладка |
| Layout | Раскладка |
| Menu | Меню |
| Toolbar | Панель инструментов |
| Status bar | Строка состояния |
| Theme | Тема |
| Dark / Light / System | Тёмная / Светлая / Как в системе |
| Language | Язык |
| OK / Cancel / Apply / Close | ОК / Отмена / Применить / Закрыть |
| Reset | Сбросить |
| Maximize | Развернуть |
| Undo / Redo | Отменить / Повторить |

## Термины документации

Термины витрины и её документации. Это не строки интерфейса, поэтому в `commonMessages` их нет. Названия компонентов (Button, TreeView, ComponentHeader) — имена из кода и не переводятся.

| English | Русский | Решение |
|---|---|---|
| Showcase | Витрина | |
| Framework | Каркас | |
| Integration | Интеграция | |
| Engine developer | Разработчик движка | |
| UI primitive | UI-примитив, примитив | |
| Token | Токен | |
| Registry | Реестр | |
| Handler | Обработчик | |
| Extension point | Точка расширения | |
| Demo scene | Демо-сцена | |
| Live example | Живой пример | |
| Overview / Foundations / Components / Shell | Обзор / Основы / Компоненты / Оболочка | Разделы витрины |
| Docking | Докинг | Устоявшийся термин, «стыковка» не прижилась |
| Hotkey, shortcut | Горячая клавиша, сочетание клавиш | |
| Hotkey scope | Область сочетаний | |
| Roving focus | Роуминговый фокус | Калька, как в документации доступности |
| Drag and drop | Перенос данных | Механизм `src/ui/dragAndDrop/`; действие пользователя — «перетаскивание» |
| Value drag | Перетаскивание значения | |
| Popup | Всплывающий элемент | |
| Popup layer | Слой всплывающих элементов | |
| Popover | Всплывающая панель | Имя компонента `Popover` не переводится |
| Trigger | Триггер | |
| Inspector | Инспектор | |
| Menu bar | Главное меню | |
| Confirm dialog | Диалог подтверждения | |
| Undo stack | Стек отмены | |
| Window tab menu | Меню вкладки окна | |
| Editor frame | Каркас страницы редактора | `EditorFrame` |
| Dictionary | Словарь | |
| Placeholder, substitution | Подстановка | |
| Message reference | Ссылка на перевод | `MessageRef` |
| Commit / preview / cancel | Фиксация / предпросмотр / отмена | Фазы протокола изменения значения |
| Promise | Промис | |
| Mock data | Мок-данные | |
| Production build | Production-сборка | |
| Store | Стор | Сторы Zustand |
| Selector | Селектор | |
| Entry point | Точка входа | |
| Source of truth | Источник правды | |
| Focus outline | Рамка фокуса | |
| Easing | Сглаживание | Кривые `--easing-*` |
| Reduced motion | Уменьшение движения | Настройка ОС `prefers-reduced-motion` |
| Assistive technologies | Вспомогательные технологии | |
| Pixel grid | Пиксельная сетка | |
| Raster | Растр | |
| Outline (of an icon drawing) | Контур | Не путать с рамкой фокуса |
| Glyph | Глиф | |
| Placeholder icon | Заглушка | Иконка `unknown`; подстановка в переводе — «подстановка» |
| Pass / fail (contrast) | Норма / ниже нормы | |

## Правила русского перевода

- Обычный регистр предложения, а не каждое слово с большой буквы: «Сбросить раскладку», а не «Сбросить Раскладку».
- Без точки в конце пунктов меню и подписей.
