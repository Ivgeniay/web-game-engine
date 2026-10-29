import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ToggleButtonDisabledExample } from './ToggleButtonDisabledExample';
import toggleButtonDisabledStyles from './ToggleButtonDisabledExample.module.css?raw';
import toggleButtonDisabledSource from './ToggleButtonDisabledExample.tsx?raw';
import { ToggleButtonExample } from './ToggleButtonExample';
import toggleButtonStyles from './ToggleButtonExample.module.css?raw';
import toggleButtonSource from './ToggleButtonExample.tsx?raw';
import { ToggleButtonIconExample } from './ToggleButtonIconExample';
import toggleButtonIconStyles from './ToggleButtonIconExample.module.css?raw';
import toggleButtonIconSource from './ToggleButtonIconExample.tsx?raw';
import { toggleButtonPageMessages } from './toggleButtonPageMessages';

export function ToggleButtonPage() {
  const doc = useDocMessages(toggleButtonPageMessages);

  return (
    <>
      <PageSection title={doc('pressedStateTitle')}>
        <p>{doc('pressedStateText')}</p>
        <p>{doc('pressedStateText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonExample.tsx', code: toggleButtonSource },
            { fileName: 'ToggleButtonExample.module.css', code: toggleButtonStyles },
          ]}
        >
          <ToggleButtonExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('iconOnlyTitle')}>
        <p>{doc('iconOnlyText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonIconExample.tsx', code: toggleButtonIconSource },
            { fileName: 'ToggleButtonIconExample.module.css', code: toggleButtonIconStyles },
          ]}
        >
          <ToggleButtonIconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('disabledTitle')}>
        <p>{doc('disabledText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonDisabledExample.tsx', code: toggleButtonDisabledSource },
            {
              fileName: 'ToggleButtonDisabledExample.module.css',
              code: toggleButtonDisabledStyles,
            },
          ]}
        >
          <ToggleButtonDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('otherPropsTitle')}>
        <p>{doc('otherPropsText')}</p>
      </PageSection>
    </>
  );
}
