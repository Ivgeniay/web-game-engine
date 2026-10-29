import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TooltipExample } from './TooltipExample';
import tooltipStyles from './TooltipExample.module.css?raw';
import tooltipSource from './TooltipExample.tsx?raw';
import { TooltipGroupExample } from './TooltipGroupExample';
import tooltipGroupStyles from './TooltipGroupExample.module.css?raw';
import tooltipGroupSource from './TooltipGroupExample.tsx?raw';
import { tooltipPageMessages } from './tooltipPageMessages';

export function TooltipPage() {
  const doc = useDocMessages(tooltipPageMessages);

  return (
    <>
      <PageSection title={doc('hintAnyTitle')}>
        <p>{doc('hintAnyText')}</p>
        <p>{doc('hintAnyText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TooltipExample.tsx', code: tooltipSource },
            { fileName: 'TooltipExample.module.css', code: tooltipStyles },
          ]}
        >
          <TooltipExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('builtIntoTitle')}>
        <p>{doc('builtIntoText')}</p>
        <p>{doc('builtIntoText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TooltipGroupExample.tsx', code: tooltipGroupSource },
            { fileName: 'TooltipGroupExample.module.css', code: tooltipGroupStyles },
          ]}
        >
          <TooltipGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('limitationsTitle')}>
        <ul>
          <li>{doc('limitationsItem')}</li>
          <li>{doc('limitationsItem2')}</li>
        </ul>
      </PageSection>
    </>
  );
}
