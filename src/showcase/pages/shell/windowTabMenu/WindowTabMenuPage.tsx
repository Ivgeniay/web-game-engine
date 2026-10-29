import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TabMenuExample } from './TabMenuExample';
import tabMenuStyles from './TabMenuExample.module.css?raw';
import tabMenuSource from './TabMenuExample.tsx?raw';
import { WindowMenuExample } from './WindowMenuExample';
import windowMenuStyles from './WindowMenuExample.module.css?raw';
import windowMenuSource from './WindowMenuExample.tsx?raw';
import { windowTabMenuPageMessages } from './windowTabMenuPageMessages';

export function WindowTabMenuPage() {
  const doc = useDocMessages(windowTabMenuPageMessages);

  return (
    <>
      <PageSection title={doc('openingTitle')}>
        <p>{doc('openingText')}</p>
      </PageSection>
      <PageSection title={doc('itemsTitle')}>
        <p>{doc('itemsText')}</p>
        <ul>
          <li>{doc('itemsItem')}</li>
          <li>{doc('itemsItem2')}</li>
          <li>{doc('itemsItem3')}</li>
        </ul>
        <p>{doc('itemsText2')}</p>
        <p>{doc('itemsText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TabMenuExample.tsx', code: tabMenuSource },
            { fileName: 'TabMenuExample.module.css', code: tabMenuStyles },
          ]}
        >
          <TabMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('windowMenuTitle')}>
        <p>{doc('windowMenuText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'WindowMenuExample.tsx', code: windowMenuSource },
            { fileName: 'WindowMenuExample.module.css', code: windowMenuStyles },
          ]}
        >
          <WindowMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('shortcutsTitle')}>
        <ul>
          <li>{doc('shortcutsItem')}</li>
          <li>{doc('shortcutsItem2')}</li>
          <li>{doc('shortcutsItem3')}</li>
        </ul>
        <p>{doc('shortcutsText')}</p>
      </PageSection>
    </>
  );
}
