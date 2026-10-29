import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { NumberFieldExample } from './NumberFieldExample';
import numberFieldStyles from './NumberFieldExample.module.css?raw';
import numberFieldSource from './NumberFieldExample.tsx?raw';
import { NumberFieldIntegerExample } from './NumberFieldIntegerExample';
import numberFieldIntegerStyles from './NumberFieldIntegerExample.module.css?raw';
import numberFieldIntegerSource from './NumberFieldIntegerExample.tsx?raw';
import { NumberFieldStatesExample } from './NumberFieldStatesExample';
import numberFieldStatesStyles from './NumberFieldStatesExample.module.css?raw';
import numberFieldStatesSource from './NumberFieldStatesExample.tsx?raw';
import { numberFieldPageMessages } from './numberFieldPageMessages';

export function NumberFieldPage() {
  const doc = useDocMessages(numberFieldPageMessages);

  return (
    <>
      <PageSection title={doc('typingNumberTitle')}>
        <p>{doc('typingNumberText')}</p>
        <p>{doc('typingNumberText2')}</p>
        <p>{doc('typingNumberText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldExample.tsx', code: numberFieldSource },
            { fileName: 'NumberFieldExample.module.css', code: numberFieldStyles },
          ]}
        >
          <NumberFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('integersRangeTitle')}>
        <p>{doc('integersRangeText')}</p>
        <p>{doc('integersRangeText2')}</p>
        <p>{doc('integersRangeText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldIntegerExample.tsx', code: numberFieldIntegerSource },
            { fileName: 'NumberFieldIntegerExample.module.css', code: numberFieldIntegerStyles },
          ]}
        >
          <NumberFieldIntegerExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('mixedReadTitle')}>
        <p>{doc('mixedReadText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldStatesExample.tsx', code: numberFieldStatesSource },
            { fileName: 'NumberFieldStatesExample.module.css', code: numberFieldStatesStyles },
          ]}
        >
          <NumberFieldStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
