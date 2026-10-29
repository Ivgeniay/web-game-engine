import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const localizationPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Localization',
    pageDescription:
      'Languages, dictionaries, substitutions, plural forms and message references for interface texts.',
    languagesTitle: 'Languages',
    languagesList:
      'The editor speaks English (`en`) and Russian (`ru`). `LANGUAGES` in `@/core/i18n/languages` lists them, and the `Language` type is derived from it. English is the default; the browser language is not taken into account.',
    languagesStorage:
      'The choice is stored in `localStorage` under the `editor-language` key. If the storage is unavailable or holds an unknown value, the editor uses English. Switching the language needs no reload: every text rendered through the localization system updates at once, and `startLanguageController` keeps the `lang` attribute of the root element in sync. Use the language switcher in the header to see the examples below in both languages.',
    languagesAdding:
      'To add a language, add it to `LANGUAGES`. The compiler then points to `PLURAL_CATEGORIES`, `LANGUAGE_NAMES` and every dictionary that lacks the new translation.',
    dictionaryTitle: 'Declaring a dictionary',
    dictionaryDeclaring:
      'Each part of the editor declares its own dictionary with `defineMessages` next to its code. There is no single file with all texts. English is the source of truth: every other language must have exactly the same keys. A missing or extra key, as well as a typo in a key passed to the translation, is a compile error.',
    dictionaryUsing:
      'Components get texts with `useMessages(dictionary)`. It returns a function `t` bound to the current language and re-renders the component when the language changes.',
    substitutionTitle: 'Substituting values',
    substitutionPlaceholders:
      'A text refers to a value with a placeholder in braces: `Scene: {name}`. The parameters are checked by the compiler: a text with placeholders requires all of them, and a text without placeholders accepts no parameters. A translation may use only the placeholders of the English text.',
    substitutionNumbers:
      'Numbers are formatted by the rules of the current language: Russian uses a decimal comma and a space between digit groups. Numbers that identify something, such as a port, a year, a version, a frame number or an id, must not be grouped: pass them as strings.',
    pluralTitle: 'Plural forms',
    pluralIntro:
      'A text that depends on a number is an object of plural forms instead of a string. The form is chosen by the `count` parameter with `Intl.PluralRules`, and `count` must be a number. Each language has its own set of forms, and the compiler requires exactly that set:',
    pluralEnglish: 'English: `one`, `other`;',
    pluralRussian:
      'Russian: `one` (1, 21, 101), `few` (2, 22), `many` (0, 5, 11, 25), `other` (fractions such as 1.5).',
    pluralTry: 'Change the count, including fractions, and switch the language to see every form.',
    refsTitle: 'Message references in data',
    refsCreating:
      'Registries, stores and any data outside components keep references to translations, not ready strings. A string translated in advance stays in the old language after switching. Create a reference with `messageRef(dictionary, key, params)`: the key and the parameters are checked just like in `t`. A component turns it into text while rendering with `useTranslate()`.',
    refsRegistries:
      'Registries of the editor declare their labels with the `MessageRef` type, so a plain string cannot get there.',
    integrationTitle: 'Integration dictionaries',
    integrationOwnDictionaries:
      'An engine integration declares its dictionaries in `src/engine/` with the same `defineMessages` and gets the same compile-time checks without editing any framework file. Its texts never go into the framework dictionaries: otherwise every framework update would conflict with the engine code.',
    integrationNoRegistry:
      'There is no global registry of keys: a component passes the dictionary it needs to `useMessages`. Keys of different dictionaries never clash, and a component can use several dictionaries, for example its own and `commonMessages` with the shared framework terms.',
    rulesTitle: 'Rules',
    rulesLinter:
      'Every interface text goes through the localization system. Everywhere except example files `*Example.tsx`, the linter rejects text written directly in JSX and string literals in text attributes such as `title` or `aria-label`. It cannot see text in constants and data, so the rule is also checked in review.',
    rulesPrimitives:
      'UI primitives do not depend on the localization system: they receive ready strings through props, and the code that uses them translates.',
    rulesGlossary:
      'Framework terms are translated according to the glossary in `docs/glossary.md`. Their translations are in `commonMessages`.',
    rulesRussianCase:
      'Russian texts use sentence case, not title case, and menu items and labels have no trailing period.',
    rulesLanguageNames:
      'Language names are written in the language itself, English and Русский, whatever the current language is, so that a user can find their language in an unfamiliar interface. They come from `LANGUAGE_NAMES`, not from a dictionary.',
  },
  ru: {
    pageTitle: 'Локализация',
    pageDescription:
      'Языки, словари, подстановки, множественные формы и ссылки на переводы для текстов интерфейса.',
    languagesTitle: 'Языки',
    languagesList:
      'Редактор говорит по-английски (`en`) и по-русски (`ru`). Языки перечислены в `LANGUAGES` из `@/core/i18n/languages`, тип `Language` выводится из этого списка. По умолчанию — английский; язык браузера не учитывается.',
    languagesStorage:
      'Выбор хранится в `localStorage` под ключом `editor-language`. Если хранилище недоступно или в нём неизвестное значение, редактор берёт английский. Смена языка не требует перезагрузки: все тексты, нарисованные через систему локализации, обновляются сразу, а `startLanguageController` поддерживает атрибут `lang` корневого элемента. Переключите язык в шапке, чтобы увидеть примеры ниже на обоих языках.',
    languagesAdding:
      'Чтобы добавить язык, впишите его в `LANGUAGES`. Компилятор сам укажет на `PLURAL_CATEGORIES`, `LANGUAGE_NAMES` и все словари, где не хватает нового перевода.',
    dictionaryTitle: 'Объявление словаря',
    dictionaryDeclaring:
      'Каждая часть редактора объявляет свой словарь через `defineMessages` рядом со своим кодом. Одного файла со всеми текстами нет. Английский — источник правды: в остальных языках должны быть ровно те же ключи. Недостающий или лишний ключ, как и опечатка в ключе при переводе, — ошибка компиляции.',
    dictionaryUsing:
      'Компоненты получают тексты через `useMessages(dictionary)`. Он возвращает функцию `t`, привязанную к текущему языку, и перерисовывает компонент при смене языка.',
    substitutionTitle: 'Подстановка значений',
    substitutionPlaceholders:
      'Текст ссылается на значение через подстановку в фигурных скобках: `Scene: {name}`. Параметры проверяет компилятор: текст с подстановками требует их все, а текст без подстановок не принимает параметров. Перевод может использовать только подстановки английского текста.',
    substitutionNumbers:
      'Числа форматируются по правилам текущего языка: в русском десятичная запятая и пробел между разрядами. Числа-идентификаторы — порт, год, версию, номер кадра, id — разбивать на разряды нельзя: передавайте их строкой.',
    pluralTitle: 'Множественные формы',
    pluralIntro:
      'Текст, который зависит от числа, — не строка, а объект множественных форм. Форма выбирается по параметру `count` через `Intl.PluralRules`, и `count` должен быть числом. У каждого языка свой набор форм, и компилятор требует ровно его:',
    pluralEnglish: 'английский: `one`, `other`;',
    pluralRussian:
      'русский: `one` (1, 21, 101), `few` (2, 22), `many` (0, 5, 11, 25), `other` (дробные, например 1,5).',
    pluralTry: 'Меняйте число, в том числе дробное, и переключайте язык, чтобы увидеть все формы.',
    refsTitle: 'Ссылки на переводы в данных',
    refsCreating:
      'Реестры, сторы и любые данные вне компонентов хранят ссылки на переводы, а не готовые строки. Строка, переведённая заранее, после переключения останется на старом языке. Ссылка создаётся через `messageRef(dictionary, key, params)`: ключ и параметры проверяются так же, как в `t`. Компонент превращает её в текст при отрисовке через `useTranslate()`.',
    refsRegistries:
      'Реестры редактора объявляют подписи типом `MessageRef`, поэтому обычная строка туда не попадёт.',
    integrationTitle: 'Словари интеграции',
    integrationOwnDictionaries:
      'Интеграция движка объявляет свои словари в `src/engine/` тем же `defineMessages` и получает те же проверки при компиляции, не правя ни одного файла каркаса. Её тексты никогда не попадают в словари каркаса: иначе каждое обновление каркаса конфликтовало бы с кодом движка.',
    integrationNoRegistry:
      'Глобального реестра ключей нет: компонент передаёт в `useMessages` нужный ему словарь. Ключи разных словарей не пересекаются, и компонент может пользоваться несколькими словарями, например своим и `commonMessages` с общими терминами каркаса.',
    rulesTitle: 'Правила',
    rulesLinter:
      'Любой текст интерфейса идёт через систему локализации. Везде, кроме файлов примеров `*Example.tsx`, линтер запрещает текст прямо в JSX и строковые литералы в текстовых атрибутах вроде `title` или `aria-label`. Текст в константах и данных он не видит, поэтому правило проверяется ещё и на ревью.',
    rulesPrimitives:
      'UI-примитивы не зависят от системы локализации: они получают готовые строки через пропсы, а переводит код, который их использует.',
    rulesGlossary:
      'Термины каркаса переводятся по глоссарию `docs/glossary.md`. Их переводы лежат в `commonMessages`.',
    rulesRussianCase:
      'Русские тексты пишутся в регистре предложения, а не с каждого слова с большой буквы, и в конце пунктов меню и подписей нет точки.',
    rulesLanguageNames:
      'Названия языков пишутся на самих этих языках — English и Русский — независимо от текущего языка, чтобы пользователь нашёл свой язык в незнакомом интерфейсе. Они берутся из `LANGUAGE_NAMES`, а не из словаря.',
  },
});
