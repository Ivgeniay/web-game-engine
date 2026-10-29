import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CommandAtStartupExample } from './CommandAtStartupExample';
import commandAtStartupStyles from './CommandAtStartupExample.module.css?raw';
import commandAtStartupSource from './CommandAtStartupExample.tsx?raw';
import { LifetimeCommandExample } from './LifetimeCommandExample';
import lifetimeCommandStyles from './LifetimeCommandExample.module.css?raw';
import lifetimeCommandSource from './LifetimeCommandExample.tsx?raw';
import { commandsPageMessages } from './commandsPageMessages';

export function CommandsPage() {
  const doc = useDocMessages(commandsPageMessages);

  return (
    <>
      <PageSection title={doc('definitionsHandlersTitle')}>
        <p>{doc('definitionsHandlersText')}</p>
        <p>{doc('definitionsHandlersText2')}</p>
        <ul>
          <li>{doc('definitionsHandlersItem')}</li>
          <li>{doc('definitionsHandlersItem2')}</li>
          <li>{doc('definitionsHandlersItem3')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('registriesIntegrationTitle')}>
        <p>{doc('registriesIntegrationText')}</p>
        <p>{doc('registriesIntegrationText2')}</p>
      </PageSection>
      <PageSection title={doc('availabilityAtTitle')}>
        <p>{doc('availabilityAtText')}</p>
        <p>{doc('availabilityAtText2')}</p>
        <p>{doc('availabilityAtText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'CommandAtStartupExample.tsx', code: commandAtStartupSource },
            { fileName: 'CommandAtStartupExample.module.css', code: commandAtStartupStyles },
          ]}
        >
          <CommandAtStartupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('registeringLifetimeTitle')}>
        <p>{doc('registeringLifetimeText')}</p>
        <p>{doc('registeringLifetimeText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'LifetimeCommandExample.tsx', code: lifetimeCommandSource },
            { fileName: 'LifetimeCommandExample.module.css', code: lifetimeCommandStyles },
          ]}
        >
          <LifetimeCommandExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('invocationTargetsTitle')}>
        <p>{doc('invocationTargetsText')}</p>
        <p>{doc('invocationTargetsText2')}</p>
      </PageSection>
      <PageSection title={doc('errorsTitle')}>
        <ul>
          <li>{doc('errorsItem')}</li>
          <li>{doc('errorsItem2')}</li>
          <li>{doc('errorsItem3')}</li>
        </ul>
      </PageSection>
    </>
  );
}
