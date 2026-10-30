import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { BreadcrumbsExample } from './BreadcrumbsExample';
import breadcrumbsStyles from './BreadcrumbsExample.module.css?raw';
import breadcrumbsSource from './BreadcrumbsExample.tsx?raw';
import { breadcrumbsPageMessages } from './breadcrumbsPageMessages';

export function BreadcrumbsPage() {
  const doc = useDocMessages(breadcrumbsPageMessages);

  return (
    <>
      <PageSection title={doc('pathTitle')}>
        <p>{doc('pathText')}</p>
        <p>{doc('pathText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'BreadcrumbsExample.tsx', code: breadcrumbsSource },
            { fileName: 'BreadcrumbsExample.module.css', code: breadcrumbsStyles },
          ]}
        >
          <BreadcrumbsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
