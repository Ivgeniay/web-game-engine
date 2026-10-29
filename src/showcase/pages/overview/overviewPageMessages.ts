import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const overviewPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Overview',
    pageDescription:
      'What the editor framework is, how this showcase is organized and how to read its pages.',
    frameworkTitle: 'What the framework is',
    frameworkPurpose:
      'This is an open framework for building browser-based game engine editors. Its layout and behavior follow familiar desktop editors: a main menu, a toolbar, docking panels, windows, a status bar, themes and localization.',
    frameworkMechanisms:
      'The framework is not tied to any engine. It provides mechanisms: registries for menus, toolbar buttons, windows and status bar items, docking, themes, localization and UI primitives. An engine developer takes the source code, places it next to the engine and adds their own windows, menu items, toolbar buttons, status bar data and translations.',
    frameworkSeparation:
      'Framework code and integration code are kept apart. The integration lives in `src/engine/`, talks to the engine through interfaces from `src/contracts/` and extends the framework through registries, never by editing framework files. The framework never imports from `src/engine/`, so framework updates arrive through git without conflicts. A demonstration integration with mock data lives next to it in `src/demo/`; the [Demo scene](overview/demo-scene) page shows how it is built.',
    showcaseTitle: 'How the showcase is organized',
    showcasePurpose:
      'The showcase is the living documentation of the framework. Every UI component and mechanism has a page here with a description, a live example and the example source code.',
    showcaseSidebar: 'The sidebar lists sections and the pages inside them.',
    showcaseAddress:
      'The page address is kept in the URL hash, for example `showcase.html#/foundations/colors`. Links can be shared, and the browser back and forward buttons work.',
    showcaseSwitchers:
      'The theme and language switchers in the header apply to every page, including this documentation. Example code is shown as is, the way an engine developer writes it.',
    showcaseDevelopmentOnly:
      'The showcase runs only in `pnpm dev` and is not part of the production build.',
    readingTitle: 'How to read a page',
    readingHeader:
      'A page starts with a title and a short description: what the thing is and when to use it. Sections below explain the details.',
    readingExamples:
      'An example block shows a live demo with its source code underneath. The demo and the code are the same file, so they can never drift apart. Examples import the framework through `@/` paths only and do not depend on the showcase, so you can copy an example into your code with the Copy button and it will work as is.',
  },
  ru: {
    pageTitle: 'Обзор',
    pageDescription: 'Что такое каркас редактора, как устроена витрина и как читать её страницы.',
    frameworkTitle: 'Что такое каркас',
    frameworkPurpose:
      'Это открытый каркас для браузерных редакторов игровых движков. Раскладкой и поведением он повторяет привычные настольные редакторы: главное меню, панель инструментов, докинг-панели, окна, строка состояния, темы и локализация.',
    frameworkMechanisms:
      'Каркас не привязан ни к какому движку. Он даёт механизмы: реестры меню, кнопок панели инструментов, окон и элементов строки состояния, докинг, темы, локализацию и UI-примитивы. Разработчик движка берёт исходный код, кладёт его рядом с движком и добавляет свои окна, пункты меню, кнопки панели инструментов, данные строки состояния и переводы.',
    frameworkSeparation:
      'Код каркаса и код интеграции разделены. Интеграция живёт в `src/engine/`, общается с движком через интерфейсы из `src/contracts/` и расширяет каркас через реестры, а не правкой его файлов. Каркас ничего не импортирует из `src/engine/`, поэтому его обновления приходят через git без конфликтов. Рядом, в `src/demo/`, лежит демонстрационная интеграция с мок-данными; как она устроена, показывает страница [Демо-сцена](overview/demo-scene).',
    showcaseTitle: 'Как устроена витрина',
    showcasePurpose:
      'Витрина — живая документация каркаса. У каждого UI-компонента и механизма здесь есть страница с описанием, живым примером и исходным кодом примера.',
    showcaseSidebar: 'В боковом меню — разделы и страницы внутри них.',
    showcaseAddress:
      'Адрес страницы хранится в хеше URL, например `showcase.html#/foundations/colors`. Ссылкой можно поделиться, кнопки браузера «Назад» и «Вперёд» работают.',
    showcaseSwitchers:
      'Переключатели темы и языка в шапке действуют на все страницы, в том числе на саму документацию. Код примеров показан как есть — так, как его пишет разработчик движка.',
    showcaseDevelopmentOnly:
      'Витрина работает только в `pnpm dev` и не входит в production-сборку.',
    readingTitle: 'Как читать страницу',
    readingHeader:
      'Страница начинается с названия и короткого описания: что это и когда это нужно. Подробности — в разделах ниже.',
    readingExamples:
      'Блок примера показывает живое демо, а под ним — исходный код. Демо и код — один и тот же файл, поэтому они не могут разойтись. Примеры импортируют каркас только через пути `@/` и не зависят от витрины: пример можно скопировать в свой код кнопкой «Копировать», и он заработает без изменений.',
  },
});
