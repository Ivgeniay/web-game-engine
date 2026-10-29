import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { FoldoutExample } from './FoldoutExample';
import foldoutStyles from './FoldoutExample.module.css?raw';
import foldoutSource from './FoldoutExample.tsx?raw';
import { foldoutPageMessages } from './foldoutPageMessages';

export function FoldoutPage() {
  const doc = useDocMessages(foldoutPageMessages);

  return (
    <>
      <PageSection title={doc('collapsibleGroupTitle')}>
        <p>{doc('collapsibleGroupText')}</p>
        <p>{doc('collapsibleGroupText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'FoldoutExample.tsx', code: foldoutSource },
            { fileName: 'FoldoutExample.module.css', code: foldoutStyles },
          ]}
        >
          <FoldoutExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
