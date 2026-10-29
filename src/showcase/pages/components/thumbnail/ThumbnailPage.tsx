import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ThumbnailExample } from './ThumbnailExample';
import thumbnailStyles from './ThumbnailExample.module.css?raw';
import thumbnailSource from './ThumbnailExample.tsx?raw';
import { thumbnailPageMessages } from './thumbnailPageMessages';

export function ThumbnailPage() {
  const doc = useDocMessages(thumbnailPageMessages);

  return (
    <>
      <PageSection title={doc('loadingTitle')}>
        <p>{doc('loadingText')}</p>
        <p>{doc('loadingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ThumbnailExample.tsx', code: thumbnailSource },
            { fileName: 'ThumbnailExample.module.css', code: thumbnailStyles },
          ]}
        >
          <ThumbnailExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('layoutTitle')}>
        <p>{doc('layoutText')}</p>
      </PageSection>
    </>
  );
}
