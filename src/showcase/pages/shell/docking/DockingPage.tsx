import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { OpenWindowsExample } from './OpenWindowsExample';
import openWindowsStyles from './OpenWindowsExample.module.css?raw';
import openWindowsSource from './OpenWindowsExample.tsx?raw';
import { WindowCommandsExample } from './WindowCommandsExample';
import windowCommandsStyles from './WindowCommandsExample.module.css?raw';
import windowCommandsSource from './WindowCommandsExample.tsx?raw';
import { dockingPageMessages } from './dockingPageMessages';

export function DockingPage() {
  const doc = useDocMessages(dockingPageMessages);

  return (
    <>
      <PageSection title={doc('windowTypesTitle')}>
        <p>{doc('windowTypesText')}</p>
        <ul>
          <li>{doc('windowTypesItem')}</li>
          <li>{doc('windowTypesItem2')}</li>
          <li>{doc('windowTypesItem3')}</li>
          <li>{doc('windowTypesItem4')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('openingClosingTitle')}>
        <p>{doc('openingClosingText')}</p>
        <ul>
          <li>{doc('openingClosingItem')}</li>
          <li>{doc('openingClosingItem2')}</li>
          <li>{doc('openingClosingItem3')}</li>
          <li>{doc('openingClosingItem4')}</li>
        </ul>
        <p>{doc('openingClosingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'OpenWindowsExample.tsx', code: openWindowsSource },
            { fileName: 'OpenWindowsExample.module.css', code: openWindowsStyles },
          ]}
        >
          <OpenWindowsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('activeWindowTitle')}>
        <p>{doc('activeWindowText')}</p>
        <p>{doc('activeWindowText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'WindowCommandsExample.tsx', code: windowCommandsSource },
            { fileName: 'WindowCommandsExample.module.css', code: windowCommandsStyles },
          ]}
        >
          <WindowCommandsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('lookTitle')}>
        <p>{doc('lookText')}</p>
      </PageSection>
    </>
  );
}
