import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TextFieldExample } from './TextFieldExample';
import textFieldStyles from './TextFieldExample.module.css?raw';
import textFieldSource from './TextFieldExample.tsx?raw';
import { TextFieldLiveExample } from './TextFieldLiveExample';
import textFieldLiveStyles from './TextFieldLiveExample.module.css?raw';
import textFieldLiveSource from './TextFieldLiveExample.tsx?raw';
import { TextFieldStatesExample } from './TextFieldStatesExample';
import textFieldStatesStyles from './TextFieldStatesExample.module.css?raw';
import textFieldStatesSource from './TextFieldStatesExample.tsx?raw';
import { TextFieldValidationExample } from './TextFieldValidationExample';
import textFieldValidationStyles from './TextFieldValidationExample.module.css?raw';
import textFieldValidationSource from './TextFieldValidationExample.tsx?raw';
import { textFieldPageMessages } from './textFieldPageMessages';

export function TextFieldPage() {
  const doc = useDocMessages(textFieldPageMessages);

  return (
    <>
      <PageSection title={doc('editingCommittingTitle')}>
        <p>{doc('editingCommittingText')}</p>
        <p>{doc('editingCommittingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldExample.tsx', code: textFieldSource },
            { fileName: 'TextFieldExample.module.css', code: textFieldStyles },
          ]}
        >
          <TextFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('liveUpdatesTitle')}>
        <p>{doc('liveUpdatesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldLiveExample.tsx', code: textFieldLiveSource },
            { fileName: 'TextFieldLiveExample.module.css', code: textFieldLiveStyles },
          ]}
        >
          <TextFieldLiveExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('invalidValueTitle')}>
        <p>{doc('invalidValueText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldValidationExample.tsx', code: textFieldValidationSource },
            { fileName: 'TextFieldValidationExample.module.css', code: textFieldValidationStyles },
          ]}
        >
          <TextFieldValidationExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('readOnlyTitle')}>
        <p>{doc('readOnlyText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldStatesExample.tsx', code: textFieldStatesSource },
            { fileName: 'TextFieldStatesExample.module.css', code: textFieldStatesStyles },
          ]}
        >
          <TextFieldStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
