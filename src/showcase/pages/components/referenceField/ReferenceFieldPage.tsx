import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ReferenceFieldExample } from './ReferenceFieldExample';
import referenceFieldStyles from './ReferenceFieldExample.module.css?raw';
import referenceFieldSource from './ReferenceFieldExample.tsx?raw';
import { referenceFieldPageMessages } from './referenceFieldPageMessages';

export function ReferenceFieldPage() {
  const doc = useDocMessages(referenceFieldPageMessages);

  return (
    <>
      <PageSection title={doc('referenceTitle')}>
        <p>{doc('referenceText')}</p>
        <p>{doc('referenceText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ReferenceFieldExample.tsx', code: referenceFieldSource },
            { fileName: 'ReferenceFieldExample.module.css', code: referenceFieldStyles },
          ]}
        >
          <ReferenceFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('inspectorTitle')}>
        <p>{doc('inspectorText')}</p>
      </PageSection>
    </>
  );
}
