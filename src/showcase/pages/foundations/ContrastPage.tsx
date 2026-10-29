import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { ContrastSection } from '@/showcase/tokens/ContrastSection';
import { contrastPageMessages } from './contrastPageMessages';

export function ContrastPage() {
  const doc = useDocMessages(contrastPageMessages);

  return (
    <>
      <PageSection title={doc('thresholdsTitle')}>
        <p>{doc('thresholdsCheck')}</p>
        <p>{doc('thresholdsNewPair')}</p>
      </PageSection>
      <PageSection title={doc('pairsTitle')}>
        <p>{doc('pairsText')}</p>
        <ContrastSection />
      </PageSection>
    </>
  );
}
