import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SeparatorExample } from './SeparatorExample';
import separatorStyles from './SeparatorExample.module.css?raw';
import separatorSource from './SeparatorExample.tsx?raw';
import { separatorPageMessages } from './separatorPageMessages';

export function SeparatorPage() {
  const doc = useDocMessages(separatorPageMessages);

  return (
    <>
      <PageSection title={doc('variantsTitle')}>
        <p>{doc('variantsText')}</p>
        <ul>
          <li>{doc('variantsItem')}</li>
          <li>{doc('variantsItem2')}</li>
        </ul>
        <p>{doc('variantsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SeparatorExample.tsx', code: separatorSource },
            { fileName: 'SeparatorExample.module.css', code: separatorStyles },
          ]}
        >
          <SeparatorExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
