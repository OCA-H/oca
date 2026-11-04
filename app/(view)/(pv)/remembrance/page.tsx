import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { RemembranceView } from './component/RemembranceView';

export const metadata = {
  title: 'Remembrance – Old Columbans Association',
  description: 'The roll of remembrance: the Columbans and masters the Old Columbans Association remembers.',
};

// The roll is edited in the admin panel (OCA Connect → Remembrance).
export default async function RemembrancePage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectRemembrance);
  return (
    <InteriorPage route="remembrance">
      <RemembranceView content={content} />
    </InteriorPage>
  );
}
