import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { LabelForFieldExample } from './LabelForFieldExample';
import labelForFieldStyles from './LabelForFieldExample.module.css?raw';
import labelForFieldSource from './LabelForFieldExample.tsx?raw';
import { LabelTonesExample } from './LabelTonesExample';
import labelTonesStyles from './LabelTonesExample.module.css?raw';
import labelTonesSource from './LabelTonesExample.tsx?raw';
import { LabelTruncateExample } from './LabelTruncateExample';
import labelTruncateStyles from './LabelTruncateExample.module.css?raw';
import labelTruncateSource from './LabelTruncateExample.tsx?raw';
import { labelPageMessages } from './labelPageMessages';

export function LabelPage() {
  const doc = useDocMessages(labelPageMessages);

  return (
    <>
      <PageSection title={doc('tonesSelectionTitle')}>
        <p>{doc('tonesSelectionText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelTonesExample.tsx', code: labelTonesSource },
            { fileName: 'LabelTonesExample.module.css', code: labelTonesStyles },
          ]}
        >
          <LabelTonesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('truncationTitle')}>
        <p>{doc('truncationText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelTruncateExample.tsx', code: labelTruncateSource },
            { fileName: 'LabelTruncateExample.module.css', code: labelTruncateStyles },
          ]}
        >
          <LabelTruncateExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('namingFieldTitle')}>
        <p>{doc('namingFieldText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelForFieldExample.tsx', code: labelForFieldSource },
            { fileName: 'LabelForFieldExample.module.css', code: labelForFieldStyles },
          ]}
        >
          <LabelForFieldExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
