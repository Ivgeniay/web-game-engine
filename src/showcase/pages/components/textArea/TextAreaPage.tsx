import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TextAreaExample } from './TextAreaExample';
import textAreaStyles from './TextAreaExample.module.css?raw';
import textAreaSource from './TextAreaExample.tsx?raw';
import { textAreaPageMessages } from './textAreaPageMessages';
import { TextAreaStatesExample } from './TextAreaStatesExample';
import textAreaStatesStyles from './TextAreaStatesExample.module.css?raw';
import textAreaStatesSource from './TextAreaStatesExample.tsx?raw';

export function TextAreaPage() {
  const doc = useDocMessages(textAreaPageMessages);

  return (
    <>
      <PageSection title={doc('editingTitle')}>
        <p>{doc('editingText')}</p>
        <p>{doc('editingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextAreaExample.tsx', code: textAreaSource },
            { fileName: 'TextAreaExample.module.css', code: textAreaStyles },
          ]}
        >
          <TextAreaExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('statesTitle')}>
        <p>{doc('statesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextAreaStatesExample.tsx', code: textAreaStatesSource },
            { fileName: 'TextAreaStatesExample.module.css', code: textAreaStatesStyles },
          ]}
        >
          <TextAreaStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
