import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { BoundsFieldExample } from './BoundsFieldExample';
import boundsFieldStyles from './BoundsFieldExample.module.css?raw';
import boundsFieldSource from './BoundsFieldExample.tsx?raw';
import { boundsFieldPageMessages } from './boundsFieldPageMessages';

export function BoundsFieldPage() {
  const doc = useDocMessages(boundsFieldPageMessages);

  return (
    <PageSection title={doc('centerSizeTitle')}>
      <p>{doc('centerSizeText')}</p>
      <p>{doc('centerSizeText2')}</p>
      <ExampleBlock
        sources={[
          { fileName: 'BoundsFieldExample.tsx', code: boundsFieldSource },
          { fileName: 'BoundsFieldExample.module.css', code: boundsFieldStyles },
        ]}
      >
        <BoundsFieldExample />
      </ExampleBlock>
    </PageSection>
  );
}
