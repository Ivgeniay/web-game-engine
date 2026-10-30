import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SearchableMenuExample } from './SearchableMenuExample';
import searchableMenuStyles from './SearchableMenuExample.module.css?raw';
import searchableMenuSource from './SearchableMenuExample.tsx?raw';
import { searchableMenuPageMessages } from './searchableMenuPageMessages';

export function SearchableMenuPage() {
  const doc = useDocMessages(searchableMenuPageMessages);

  return (
    <>
      <PageSection title={doc('menuTitle')}>
        <p>{doc('menuText')}</p>
        <p>{doc('menuText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SearchableMenuExample.tsx', code: searchableMenuSource },
            { fileName: 'SearchableMenuExample.module.css', code: searchableMenuStyles },
          ]}
        >
          <SearchableMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
