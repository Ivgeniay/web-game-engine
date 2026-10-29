import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { overviewPageMessages } from './overviewPageMessages';

export function OverviewPage() {
  const doc = useDocMessages(overviewPageMessages);

  return (
    <>
      <PageSection title={doc('frameworkTitle')}>
        <p>{doc('frameworkPurpose')}</p>
        <p>{doc('frameworkMechanisms')}</p>
        <p>{doc('frameworkSeparation')}</p>
      </PageSection>
      <PageSection title={doc('showcaseTitle')}>
        <p>{doc('showcasePurpose')}</p>
        <ul>
          <li>{doc('showcaseSidebar')}</li>
          <li>{doc('showcaseAddress')}</li>
          <li>{doc('showcaseSwitchers')}</li>
          <li>{doc('showcaseDevelopmentOnly')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('readingTitle')}>
        <p>{doc('readingHeader')}</p>
        <p>{doc('readingExamples')}</p>
      </PageSection>
    </>
  );
}
