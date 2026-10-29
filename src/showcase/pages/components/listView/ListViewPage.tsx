import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ListViewCustomRowExample } from './ListViewCustomRowExample';
import listViewCustomRowStyles from './ListViewCustomRowExample.module.css?raw';
import listViewCustomRowSource from './ListViewCustomRowExample.tsx?raw';
import { ListViewExample } from './ListViewExample';
import listViewStyles from './ListViewExample.module.css?raw';
import listViewSource from './ListViewExample.tsx?raw';
import { ListViewLargeExample } from './ListViewLargeExample';
import listViewLargeStyles from './ListViewLargeExample.module.css?raw';
import listViewLargeSource from './ListViewLargeExample.tsx?raw';
import { listViewPageMessages } from './listViewPageMessages';

export function ListViewPage() {
  const doc = useDocMessages(listViewPageMessages);

  return (
    <>
      <PageSection title={doc('listSelectionTitle')}>
        <p>{doc('listSelectionText')}</p>
        <p>{doc('listSelectionText2')}</p>
        <p>{doc('listSelectionText3')}</p>
        <p>{doc('listSelectionText4')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewExample.tsx', code: listViewSource },
            { fileName: 'ListViewExample.module.css', code: listViewStyles },
          ]}
        >
          <ListViewExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('thousandsRowsTitle')}>
        <p>{doc('thousandsRowsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewLargeExample.tsx', code: listViewLargeSource },
            { fileName: 'ListViewLargeExample.module.css', code: listViewLargeStyles },
          ]}
        >
          <ListViewLargeExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('customRowTitle')}>
        <p>{doc('customRowText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ListViewCustomRowExample.tsx', code: listViewCustomRowSource },
            { fileName: 'ListViewCustomRowExample.module.css', code: listViewCustomRowStyles },
          ]}
        >
          <ListViewCustomRowExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <ul>
          <li>{doc('keyboardItem')}</li>
          <li>{doc('keyboardItem2')}</li>
          <li>{doc('keyboardItem3')}</li>
          <li>{doc('keyboardItem4')}</li>
        </ul>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
