import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SplitButtonExample } from './SplitButtonExample';
import splitButtonStyles from './SplitButtonExample.module.css?raw';
import splitButtonSource from './SplitButtonExample.tsx?raw';
import { splitButtonPageMessages } from './splitButtonPageMessages';

export function SplitButtonPage() {
  const doc = useDocMessages(splitButtonPageMessages);

  return (
    <>
      <PageSection title={doc('actionVariantsTitle')}>
        <p>{doc('actionVariantsText')}</p>
        <p>{doc('actionVariantsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SplitButtonExample.tsx', code: splitButtonSource },
            { fileName: 'SplitButtonExample.module.css', code: splitButtonStyles },
          ]}
        >
          <SplitButtonExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
