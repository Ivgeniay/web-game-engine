import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { LayoutExample } from './LayoutExample';
import layoutStyles from './LayoutExample.module.css?raw';
import layoutSource from './LayoutExample.tsx?raw';
import { layoutPageMessages } from './layoutPageMessages';

export function LayoutPage() {
  const doc = useDocMessages(layoutPageMessages);

  return (
    <>
      <PageSection title={doc('defaultLayoutTitle')}>
        <p>{doc('defaultLayoutText')}</p>
        <ul>
          <li>{doc('defaultLayoutItem')}</li>
          <li>{doc('defaultLayoutItem2')}</li>
          <li>{doc('defaultLayoutItem3')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('savingRestoringTitle')}>
        <p>{doc('savingRestoringText')}</p>
        <ul>
          <li>{doc('savingRestoringItem')}</li>
          <li>{doc('savingRestoringItem2')}</li>
          <li>{doc('savingRestoringItem3')}</li>
          <li>{doc('savingRestoringItem4')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('resetTitle')}>
        <p>{doc('resetText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'LayoutExample.tsx', code: layoutSource },
            { fileName: 'LayoutExample.module.css', code: layoutStyles },
          ]}
        >
          <LayoutExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
