import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ClippedContainerExample } from './ClippedContainerExample';
import clippedContainerStyles from './ClippedContainerExample.module.css?raw';
import clippedContainerSource from './ClippedContainerExample.tsx?raw';
import { popupLayerPageMessages } from './popupLayerPageMessages';

export function PopupLayerPage() {
  const doc = useDocMessages(popupLayerPageMessages);

  return (
    <>
      <PageSection title={doc('oneLayerTitle')}>
        <p>{doc('oneLayerText')}</p>
        <p>{doc('oneLayerText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ClippedContainerExample.tsx', code: clippedContainerSource },
            { fileName: 'ClippedContainerExample.module.css', code: clippedContainerStyles },
          ]}
        >
          <ClippedContainerExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('connectingLayerTitle')}>
        <p>{doc('connectingLayerText')}</p>
      </PageSection>
      <PageSection title={doc('stackingPositionTitle')}>
        <p>{doc('stackingPositionText')}</p>
        <p>{doc('stackingPositionText2')}</p>
      </PageSection>
    </>
  );
}
