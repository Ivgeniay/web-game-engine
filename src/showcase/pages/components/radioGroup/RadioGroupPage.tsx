import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { RadioGroupDisabledExample } from './RadioGroupDisabledExample';
import radioGroupDisabledStyles from './RadioGroupDisabledExample.module.css?raw';
import radioGroupDisabledSource from './RadioGroupDisabledExample.tsx?raw';
import { RadioGroupExample } from './RadioGroupExample';
import radioGroupStyles from './RadioGroupExample.module.css?raw';
import radioGroupSource from './RadioGroupExample.tsx?raw';
import { RadioGroupHorizontalExample } from './RadioGroupHorizontalExample';
import radioGroupHorizontalStyles from './RadioGroupHorizontalExample.module.css?raw';
import radioGroupHorizontalSource from './RadioGroupHorizontalExample.tsx?raw';
import { radioGroupPageMessages } from './radioGroupPageMessages';

export function RadioGroupPage() {
  const doc = useDocMessages(radioGroupPageMessages);

  return (
    <>
      <PageSection title={doc('choosingOneTitle')}>
        <p>{doc('choosingOneText')}</p>
        <p>{doc('choosingOneText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupExample.tsx', code: radioGroupSource },
            { fileName: 'RadioGroupExample.module.css', code: radioGroupStyles },
          ]}
        >
          <RadioGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('horizontalLayoutTitle')}>
        <p>{doc('horizontalLayoutText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupHorizontalExample.tsx', code: radioGroupHorizontalSource },
            {
              fileName: 'RadioGroupHorizontalExample.module.css',
              code: radioGroupHorizontalStyles,
            },
          ]}
        >
          <RadioGroupHorizontalExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('disabledOptionsTitle')}>
        <p>{doc('disabledOptionsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupDisabledExample.tsx', code: radioGroupDisabledSource },
            { fileName: 'RadioGroupDisabledExample.module.css', code: radioGroupDisabledStyles },
          ]}
        >
          <RadioGroupDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
