import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { PopoverExample } from './PopoverExample';
import popoverStyles from './PopoverExample.module.css?raw';
import popoverSource from './PopoverExample.tsx?raw';
import { popoverPageMessages } from './popoverPageMessages';

export function PopoverPage() {
  const doc = useDocMessages(popoverPageMessages);

  return (
    <>
      <PageSection title={doc('panelAtTitle')}>
        <p>{doc('panelAtText')}</p>
        <p>{doc('panelAtText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'PopoverExample.tsx', code: popoverSource },
            { fileName: 'PopoverExample.module.css', code: popoverStyles },
          ]}
        >
          <PopoverExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('controlOutsideTitle')}>
        <p>{doc('controlOutsideText')}</p>
      </PageSection>
    </>
  );
}
