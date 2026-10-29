import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { getSizeTokenNames } from '@/showcase/tokens/tokenNames';
import { sizesPageMessages } from './sizesPageMessages';

export function SizesPage() {
  const doc = useDocMessages(sizesPageMessages);

  return (
    <>
      <PageSection title={doc('controlsTitle')}>
        <p>{doc('controlsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('control')} />
      </PageSection>
      <PageSection title={doc('panelsTitle')}>
        <p>{doc('panelsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('panel')} />
      </PageSection>
      <PageSection title={doc('iconsTitle')}>
        <p>{doc('iconsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('icon')} />
      </PageSection>
      <PageSection title={doc('bordersTitle')}>
        <p>{doc('bordersText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('border')} />
      </PageSection>
      <PageSection title={doc('scrollbarTitle')}>
        <p>{doc('scrollbarText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('scrollbar')} />
      </PageSection>
      <PageSection title={doc('propertyRowsTitle')}>
        <p>{doc('propertyRowsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('property')} />
      </PageSection>
      <PageSection title={doc('listsTitle')}>
        <p>{doc('listsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('list')} />
      </PageSection>
      <PageSection title={doc('fieldsTitle')}>
        <p>{doc('fieldsText')}</p>
        <TokenSection group="size" names={getSizeTokenNames('field')} />
      </PageSection>
    </>
  );
}
