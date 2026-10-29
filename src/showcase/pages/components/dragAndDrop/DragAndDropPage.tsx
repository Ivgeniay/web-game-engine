import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { DragAndDropExample } from './DragAndDropExample';
import dragAndDropStyles from './DragAndDropExample.module.css?raw';
import dragAndDropSource from './DragAndDropExample.tsx?raw';
import { dragAndDropPageMessages } from './dragAndDropPageMessages';

export function DragAndDropPage() {
  const doc = useDocMessages(dragAndDropPageMessages);

  return (
    <>
      <PageSection title={doc('movingDataTitle')}>
        <p>{doc('movingDataText')}</p>
        <p>{doc('movingDataText2')}</p>
      </PageSection>
      <PageSection title={doc('sourcesTargetsTitle')}>
        <p>{doc('sourcesTargetsText')}</p>
        <p>{doc('sourcesTargetsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'DragAndDropExample.tsx', code: dragAndDropSource },
            { fileName: 'DragAndDropExample.module.css', code: dragAndDropStyles },
          ]}
        >
          <DragAndDropExample />
        </ExampleBlock>
        <p>{doc('sourcesTargetsText3')}</p>
      </PageSection>
    </>
  );
}
