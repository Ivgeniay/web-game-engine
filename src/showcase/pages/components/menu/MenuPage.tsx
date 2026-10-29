import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ContextMenuExample } from './ContextMenuExample';
import contextMenuStyles from './ContextMenuExample.module.css?raw';
import contextMenuSource from './ContextMenuExample.tsx?raw';
import { MenuItemKindsExample } from './MenuItemKindsExample';
import menuItemKindsStyles from './MenuItemKindsExample.module.css?raw';
import menuItemKindsSource from './MenuItemKindsExample.tsx?raw';
import { ToolbarMenuExample } from './ToolbarMenuExample';
import toolbarMenuStyles from './ToolbarMenuExample.module.css?raw';
import toolbarMenuSource from './ToolbarMenuExample.tsx?raw';
import { menuPageMessages } from './menuPageMessages';

export function MenuPage() {
  const doc = useDocMessages(menuPageMessages);

  return (
    <>
      <PageSection title={doc('menuButtonTitle')}>
        <p>{doc('menuButtonText')}</p>
        <p>{doc('menuButtonText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToolbarMenuExample.tsx', code: toolbarMenuSource },
            { fileName: 'ToolbarMenuExample.module.css', code: toolbarMenuStyles },
          ]}
        >
          <ToolbarMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('kindsItemsTitle')}>
        <p>{doc('kindsItemsText')}</p>
        <ul>
          <li>{doc('kindsItemsItem')}</li>
          <li>{doc('kindsItemsItem2')}</li>
          <li>{doc('kindsItemsItem3')}</li>
          <li>{doc('kindsItemsItem4')}</li>
          <li>{doc('kindsItemsItem5')}</li>
        </ul>
        <p>{doc('kindsItemsText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'MenuItemKindsExample.tsx', code: menuItemKindsSource },
            { fileName: 'MenuItemKindsExample.module.css', code: menuItemKindsStyles },
          ]}
        >
          <MenuItemKindsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('menuAtTitle')}>
        <p>{doc('menuAtText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ContextMenuExample.tsx', code: contextMenuSource },
            { fileName: 'ContextMenuExample.module.css', code: contextMenuStyles },
          ]}
        >
          <ContextMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <ul>
          <li>{doc('keyboardItem')}</li>
          <li>{doc('keyboardItem2')}</li>
          <li>{doc('keyboardItem3')}</li>
          <li>{doc('keyboardItem4')}</li>
          <li>{doc('keyboardItem5')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('controlOutsideTitle')}>
        <p>{doc('controlOutsideText')}</p>
        <p>{doc('controlOutsideText2')}</p>
      </PageSection>
    </>
  );
}
