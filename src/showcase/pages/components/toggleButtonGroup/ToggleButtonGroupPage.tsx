import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconOptionsExample } from './IconOptionsExample';
import iconOptionsStyles from './IconOptionsExample.module.css?raw';
import iconOptionsSource from './IconOptionsExample.tsx?raw';
import { MultipleSelectionExample } from './MultipleSelectionExample';
import multipleSelectionStyles from './MultipleSelectionExample.module.css?raw';
import multipleSelectionSource from './MultipleSelectionExample.tsx?raw';
import { OptionalSelectionExample } from './OptionalSelectionExample';
import optionalSelectionStyles from './OptionalSelectionExample.module.css?raw';
import optionalSelectionSource from './OptionalSelectionExample.tsx?raw';
import { SingleSelectionExample } from './SingleSelectionExample';
import singleSelectionStyles from './SingleSelectionExample.module.css?raw';
import singleSelectionSource from './SingleSelectionExample.tsx?raw';
import { toggleButtonGroupPageMessages } from './toggleButtonGroupPageMessages';

export function ToggleButtonGroupPage() {
  const doc = useDocMessages(toggleButtonGroupPageMessages);

  return (
    <>
      <PageSection title={doc('whenUseTitle')}>
        <p>{doc('whenUseText')}</p>
        <p>{doc('whenUseText2')}</p>
      </PageSection>
      <PageSection title={doc('exactlyOneTitle')}>
        <p>{doc('exactlyOneText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SingleSelectionExample.tsx', code: singleSelectionSource },
            { fileName: 'SingleSelectionExample.module.css', code: singleSelectionStyles },
          ]}
        >
          <SingleSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('noneOneTitle')}>
        <p>{doc('noneOneText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'OptionalSelectionExample.tsx', code: optionalSelectionSource },
            { fileName: 'OptionalSelectionExample.module.css', code: optionalSelectionStyles },
          ]}
        >
          <OptionalSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('severalTitle')}>
        <p>{doc('severalText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'MultipleSelectionExample.tsx', code: multipleSelectionSource },
            { fileName: 'MultipleSelectionExample.module.css', code: multipleSelectionStyles },
          ]}
        >
          <MultipleSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('optionsTitle')}>
        <p>{doc('optionsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IconOptionsExample.tsx', code: iconOptionsSource },
            { fileName: 'IconOptionsExample.module.css', code: iconOptionsStyles },
          ]}
        >
          <IconOptionsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardAccessibilityTitle')}>
        <p>{doc('keyboardAccessibilityText')}</p>
      </PageSection>
    </>
  );
}
