import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { RovingFocusGroupExample } from './RovingFocusGroupExample';
import rovingFocusGroupStyles from './RovingFocusGroupExample.module.css?raw';
import rovingFocusGroupSource from './RovingFocusGroupExample.tsx?raw';
import { RovingFocusItemExample } from './RovingFocusItemExample';
import rovingFocusItemStyles from './RovingFocusItemExample.module.css?raw';
import rovingFocusItemSource from './RovingFocusItemExample.tsx?raw';
import { rovingFocusPageMessages } from './rovingFocusPageMessages';

export function RovingFocusPage() {
  const doc = useDocMessages(rovingFocusPageMessages);

  return (
    <>
      <PageSection title={doc('howWorksTitle')}>
        <p>{doc('howWorksText')}</p>
        <ul>
          <li>{doc('howWorksItem')}</li>
          <li>{doc('howWorksItem2')}</li>
          <li>{doc('howWorksItem3')}</li>
          <li>{doc('howWorksItem4')}</li>
          <li>{doc('howWorksItem5')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('groupButtonsTitle')}>
        <p>{doc('groupButtonsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'RovingFocusGroupExample.tsx', code: rovingFocusGroupSource },
            { fileName: 'RovingFocusGroupExample.module.css', code: rovingFocusGroupStyles },
          ]}
        >
          <RovingFocusGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('customItemsTitle')}>
        <p>{doc('customItemsText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'RovingFocusItemExample.tsx', code: rovingFocusItemSource },
            { fileName: 'RovingFocusItemExample.module.css', code: rovingFocusItemStyles },
          ]}
        >
          <RovingFocusItemExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('nestedGroupsTitle')}>
        <p>{doc('nestedGroupsText')}</p>
        <p>{doc('nestedGroupsText2')}</p>
      </PageSection>
    </>
  );
}
