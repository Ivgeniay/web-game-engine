import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ValueDragExample } from './ValueDragExample';
import valueDragStyles from './ValueDragExample.module.css?raw';
import valueDragSource from './ValueDragExample.tsx?raw';
import { valueDragPageMessages } from './valueDragPageMessages';

export function ValueDragPage() {
  const doc = useDocMessages(valueDragPageMessages);

  return (
    <>
      <PageSection title={doc('draggingNumberTitle')}>
        <p>{doc('draggingNumberText')}</p>
        <p>{doc('draggingNumberText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ValueDragExample.tsx', code: valueDragSource },
            { fileName: 'ValueDragExample.module.css', code: valueDragStyles },
          ]}
        >
          <ValueDragExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('protocolThresholdTitle')}>
        <p>{doc('protocolThresholdText')}</p>
      </PageSection>
      <PageSection title={doc('infiniteDragTitle')}>
        <p>{doc('infiniteDragText')}</p>
      </PageSection>
    </>
  );
}
