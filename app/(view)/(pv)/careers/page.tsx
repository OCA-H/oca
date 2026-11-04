import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { CareersView } from './component/CareersView';

export const metadata = {
  title: 'Careers – Old Columbans Association',
  description: 'A place for Columbans to hire Columbans.',
};

// Edited in the admin panel (OCA Connect → Careers).
export default async function CareersPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectCareers);
  return (
    <InteriorPage route="careers">
      <CareersView content={content} />
    </InteriorPage>
  );
}
