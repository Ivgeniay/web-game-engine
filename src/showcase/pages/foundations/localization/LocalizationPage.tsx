import { useDocMessages } from '@/showcase/i18n/useDocMessages';
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
import { localizationPageMessages } from './localizationPageMessages';
import { PluralExample } from './PluralExample';
import pluralStyles from './PluralExample.module.css?raw';
import pluralSource from './PluralExample.tsx?raw';

export function LocalizationPage() {
  const doc = useDocMessages(localizationPageMessages);

  return (
    <>
      <PageSection title={doc('languagesTitle')}>
        <p>{doc('languagesList')}</p>
        <p>{doc('languagesStorage')}</p>
        <p>{doc('languagesAdding')}</p>
      </PageSection>
      <PageSection title={doc('dictionaryTitle')}>
        <p>{doc('dictionaryDeclaring')}</p>
        <p>{doc('dictionaryUsing')}</p>
        <ExampleBlock sources={[{ fileName: 'DictionaryExample.tsx', code: dictionarySource }]}>
          <DictionaryExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('substitutionTitle')}>
        <p>{doc('substitutionPlaceholders')}</p>
        <p>{doc('substitutionNumbers')}</p>
        <ExampleBlock
          sources={[{ fileName: 'InterpolationExample.tsx', code: interpolationSource }]}
        >
          <InterpolationExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('pluralTitle')}>
        <p>{doc('pluralIntro')}</p>
        <ul>
          <li>{doc('pluralEnglish')}</li>
          <li>{doc('pluralRussian')}</li>
        </ul>
        <p>{doc('pluralTry')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PluralExample.tsx', code: pluralSource },
            { fileName: 'PluralExample.module.css', code: pluralStyles },
          ]}
        >
          <PluralExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('refsTitle')}>
        <p>{doc('refsCreating')}</p>
        <p>{doc('refsRegistries')}</p>
        <ExampleBlock sources={[{ fileName: 'MessageRefExample.tsx', code: messageRefSource }]}>
          <MessageRefExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('integrationTitle')}>
        <p>{doc('integrationOwnDictionaries')}</p>
        <p>{doc('integrationNoRegistry')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IntegrationDictionaryExample.tsx', code: integrationDictionarySource },
          ]}
        >
          <IntegrationDictionaryExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('rulesTitle')}>
        <ul>
          <li>{doc('rulesLinter')}</li>
          <li>{doc('rulesPrimitives')}</li>
          <li>{doc('rulesGlossary')}</li>
          <li>{doc('rulesRussianCase')}</li>
          <li>{doc('rulesLanguageNames')}</li>
        </ul>
      </PageSection>
    </>
  );
}
