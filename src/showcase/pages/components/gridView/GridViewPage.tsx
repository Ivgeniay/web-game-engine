import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { GridViewExample } from './GridViewExample';
import gridViewStyles from './GridViewExample.module.css?raw';
import gridViewSource from './GridViewExample.tsx?raw';
import { gridViewPageMessages } from './gridViewPageMessages';

export function GridViewPage() {
  const doc = useDocMessages(gridViewPageMessages);

  return (
    <>
      <PageSection title={doc('gridTitle')}>
        <p>{doc('gridText')}</p>
        <p>{doc('gridText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'GridViewExample.tsx', code: gridViewSource },
            { fileName: 'GridViewExample.module.css', code: gridViewStyles },
          ]}
        >
          <GridViewExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
        <p>{doc('keyboardText2')}</p>
      </PageSection>
    </>
  );
}
