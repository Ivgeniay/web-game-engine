import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SearchFieldExample } from './SearchFieldExample';
import searchFieldStyles from './SearchFieldExample.module.css?raw';
import searchFieldSource from './SearchFieldExample.tsx?raw';
import { searchFieldPageMessages } from './searchFieldPageMessages';

export function SearchFieldPage() {
  const doc = useDocMessages(searchFieldPageMessages);

  return (
    <>
      <PageSection title={doc('filteringTitle')}>
        <p>{doc('filteringText')}</p>
        <p>{doc('filteringText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SearchFieldExample.tsx', code: searchFieldSource },
            { fileName: 'SearchFieldExample.module.css', code: searchFieldStyles },
          ]}
        >
          <SearchFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardOtherTitle')}>
        <p>{doc('keyboardOtherText')}</p>
      </PageSection>
    </>
  );
}
