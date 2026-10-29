import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { MenuBarExample } from './MenuBarExample';
import menuBarStyles from './MenuBarExample.module.css?raw';
import menuBarSource from './MenuBarExample.tsx?raw';
import { menuBarPageMessages } from './menuBarPageMessages';

export function MenuBarPage() {
  const doc = useDocMessages(menuBarPageMessages);

  return (
    <>
      <PageSection title={doc('registeringMenusTitle')}>
        <p>{doc('registeringMenusText')}</p>
        <ul>
          <li>{doc('registeringMenusItem')}</li>
          <li>{doc('registeringMenusItem2')}</li>
          <li>{doc('registeringMenusItem3')}</li>
          <li>{doc('registeringMenusItem4')}</li>
        </ul>
        <p>{doc('registeringMenusText2')}</p>
      </PageSection>
      <PageSection title={doc('exampleTitle')}>
        <p>{doc('exampleText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'MenuBarExample.tsx', code: menuBarSource },
            { fileName: 'MenuBarExample.module.css', code: menuBarStyles },
          ]}
        >
          <MenuBarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardMouseTitle')}>
        <ul>
          <li>{doc('keyboardMouseItem')}</li>
          <li>{doc('keyboardMouseItem2')}</li>
          <li>{doc('keyboardMouseItem3')}</li>
          <li>{doc('keyboardMouseItem4')}</li>
          <li>{doc('keyboardMouseItem5')}</li>
        </ul>
      </PageSection>
    </>
  );
}
