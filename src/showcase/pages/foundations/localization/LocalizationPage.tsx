import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { DictionaryExample } from './DictionaryExample';
import dictionarySource from './DictionaryExample.tsx?raw';
import { IntegrationDictionaryExample } from './IntegrationDictionaryExample';
import integrationDictionarySource from './IntegrationDictionaryExample.tsx?raw';
import { InterpolationExample } from './InterpolationExample';
import interpolationSource from './InterpolationExample.tsx?raw';
import { MessageRefExample } from './MessageRefExample';
import messageRefSource from './MessageRefExample.tsx?raw';
import { PluralExample } from './PluralExample';
import pluralStyles from './PluralExample.module.css?raw';
import pluralSource from './PluralExample.tsx?raw';

export function LocalizationPage() {
  return (
    <>
      <PageSection title="Languages">
        <p>
          The editor speaks English (<code>en</code>) and Russian (<code>ru</code>).{' '}
          <code>LANGUAGES</code> in <code>@/core/i18n/languages</code> lists them, and the{' '}
          <code>Language</code> type is derived from it. English is the default; the browser
          language is not taken into account.
        </p>
        <p>
          The choice is stored in <code>localStorage</code> under the <code>editor-language</code>{' '}
          key. If the storage is unavailable or holds an unknown value, the editor uses English.
          Switching the language needs no reload: every text rendered through the localization
          system updates at once, and <code>startLanguageController</code> keeps the{' '}
          <code>lang</code> attribute of the root element in sync. Use the language switcher in the
          header to see the examples below in both languages.
        </p>
        <p>
          To add a language, add it to <code>LANGUAGES</code>. The compiler then points to{' '}
          <code>PLURAL_CATEGORIES</code>, <code>LANGUAGE_NAMES</code> and every dictionary that
          lacks the new translation.
        </p>
      </PageSection>
      <PageSection title="Declaring a dictionary">
        <p>
          Each part of the editor declares its own dictionary with <code>defineMessages</code> next
          to its code. There is no single file with all texts. English is the source of truth: every
          other language must have exactly the same keys. A missing or extra key, as well as a typo
          in a key passed to the translation, is a compile error.
        </p>
        <p>
          Components get texts with <code>useMessages(dictionary)</code>. It returns a function{' '}
          <code>t</code> bound to the current language and re-renders the component when the
          language changes.
        </p>
        <ExampleBlock sources={[{ fileName: 'DictionaryExample.tsx', code: dictionarySource }]}>
          <DictionaryExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Substituting values">
        <p>
          A text refers to a value with a placeholder in braces: <code>{'Scene: {name}'}</code>. The
          parameters are checked by the compiler: a text with placeholders requires all of them, and
          a text without placeholders accepts no parameters. A translation may use only the
          placeholders of the English text.
        </p>
        <p>
          Numbers are formatted by the rules of the current language: Russian uses a decimal comma
          and a space between digit groups. Numbers that identify something, such as a port, a year,
          a version, a frame number or an id, must not be grouped: pass them as strings.
        </p>
        <ExampleBlock
          sources={[{ fileName: 'InterpolationExample.tsx', code: interpolationSource }]}
        >
          <InterpolationExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Plural forms">
        <p>
          A text that depends on a number is an object of plural forms instead of a string. The form
          is chosen by the <code>count</code> parameter with <code>Intl.PluralRules</code>, and{' '}
          <code>count</code> must be a number. Each language has its own set of forms, and the
          compiler requires exactly that set:
        </p>
        <ul>
          <li>
            English: <code>one</code>, <code>other</code>;
          </li>
          <li>
            Russian: <code>one</code> (1, 21, 101), <code>few</code> (2, 22), <code>many</code> (0,
            5, 11, 25), <code>other</code> (fractions such as 1.5).
          </li>
        </ul>
        <p>Change the count, including fractions, and switch the language to see every form.</p>
        <ExampleBlock
          sources={[
            { fileName: 'PluralExample.tsx', code: pluralSource },
            { fileName: 'PluralExample.module.css', code: pluralStyles },
          ]}
        >
          <PluralExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Message references in data">
        <p>
          Registries, stores and any data outside components keep references to translations, not
          ready strings. A string translated in advance stays in the old language after switching.
          Create a reference with <code>messageRef(dictionary, key, params)</code>: the key and the
          parameters are checked just like in <code>t</code>. A component turns it into text while
          rendering with <code>useTranslate()</code>.
        </p>
        <p>
          Registries of the editor declare their labels with the <code>MessageRef</code> type, so a
          plain string cannot get there.
        </p>
        <ExampleBlock sources={[{ fileName: 'MessageRefExample.tsx', code: messageRefSource }]}>
          <MessageRefExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Integration dictionaries">
        <p>
          An engine integration declares its dictionaries in <code>src/engine/</code> with the same{' '}
          <code>defineMessages</code> and gets the same compile-time checks without editing any
          framework file. Its texts never go into the framework dictionaries: otherwise every
          framework update would conflict with the engine code.
        </p>
        <p>
          There is no global registry of keys: a component passes the dictionary it needs to{' '}
          <code>useMessages</code>. Keys of different dictionaries never clash, and a component can
          use several dictionaries, for example its own and <code>commonMessages</code> with the
          shared framework terms.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IntegrationDictionaryExample.tsx', code: integrationDictionarySource },
          ]}
        >
          <IntegrationDictionaryExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Rules">
        <ul>
          <li>
            Every interface text goes through the localization system. Outside the showcase, the
            linter rejects text written directly in JSX and string literals in text attributes such
            as <code>title</code> or <code>aria-label</code>. It cannot see text in constants and
            data, so the rule is also checked in review.
          </li>
          <li>
            UI primitives do not depend on the localization system: they receive ready strings
            through props, and the code that uses them translates.
          </li>
          <li>
            Framework terms are translated according to the glossary in{' '}
            <code>docs/glossary.md</code>. Their translations are in <code>commonMessages</code>.
          </li>
          <li>
            Russian texts use sentence case, not title case, and menu items and labels have no
            trailing period.
          </li>
          <li>
            Language names are written in the language itself, English and Русский, whatever the
            current language is, so that a user can find their language in an unfamiliar interface.
            They come from <code>LANGUAGE_NAMES</code>, not from a dictionary.
          </li>
        </ul>
      </PageSection>
    </>
  );
}
