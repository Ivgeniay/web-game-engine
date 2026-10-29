import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { RectFieldExample } from './RectFieldExample';
import rectFieldStyles from './RectFieldExample.module.css?raw';
import rectFieldSource from './RectFieldExample.tsx?raw';
import { rectFieldPageMessages } from './rectFieldPageMessages';

export function RectFieldPage() {
  const doc = useDocMessages(rectFieldPageMessages);

  return (
    <PageSection title={doc('positionSizeTitle')}>
      <p>{doc('positionSizeText')}</p>
      <p>{doc('positionSizeText2')}</p>
      <ExampleBlock
        sources={[
          { fileName: 'RectFieldExample.tsx', code: rectFieldSource },
          { fileName: 'RectFieldExample.module.css', code: rectFieldStyles },
        ]}
      >
        <RectFieldExample />
      </ExampleBlock>
    </PageSection>
  );
}
