import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ContextMenuExample } from './ContextMenuExample';
import { ContextMenuItemsExample } from './ContextMenuItemsExample';
import contextMenuItemsStyles from './ContextMenuItemsExample.module.css?raw';
import contextMenuItemsSource from './ContextMenuItemsExample.tsx?raw';
import contextMenuStyles from './ContextMenuExample.module.css?raw';
import contextMenuSource from './ContextMenuExample.tsx?raw';
import { contextMenuPageMessages } from './contextMenuPageMessages';

export function ContextMenuPage() {
  const doc = useDocMessages(contextMenuPageMessages);

  return (
    <>
      <PageSection title={doc('contextsTitle')}>
        <p>{doc('contextsText')}</p>
        <p>{doc('contextsText2')}</p>
      </PageSection>
      <PageSection title={doc('targetsTitle')}>
        <p>{doc('targetsText')}</p>
      </PageSection>
      <PageSection title={doc('openingTitle')}>
        <p>{doc('openingText')}</p>
        <ul>
          <li>{doc('openingItem')}</li>
          <li>{doc('openingItem2')}</li>
          <li>{doc('openingItem3')}</li>
          <li>{doc('openingItem4')}</li>
        </ul>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuExample.tsx', code: contextMenuSource },
            { fileName: 'ContextMenuExample.module.css', code: contextMenuStyles },
          ]}
        >
          <ContextMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('itemsComponentTitle')}>
        <p>{doc('itemsComponentText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuItemsExample.tsx', code: contextMenuItemsSource },
            { fileName: 'ContextMenuItemsExample.module.css', code: contextMenuItemsStyles },
          ]}
        >
          <ContextMenuItemsExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
