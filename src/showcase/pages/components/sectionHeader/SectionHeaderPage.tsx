import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SectionHeaderExample } from './SectionHeaderExample';
import sectionHeaderStyles from './SectionHeaderExample.module.css?raw';
import sectionHeaderSource from './SectionHeaderExample.tsx?raw';
import { sectionHeaderPageMessages } from './sectionHeaderPageMessages';

export function SectionHeaderPage() {
  const doc = useDocMessages(sectionHeaderPageMessages);

  return (
    <>
      <PageSection title={doc('groupTitle')}>
        <p>{doc('groupText')}</p>
        <p>{doc('groupText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SectionHeaderExample.tsx', code: sectionHeaderSource },
            { fileName: 'SectionHeaderExample.module.css', code: sectionHeaderStyles },
          ]}
        >
          <SectionHeaderExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
