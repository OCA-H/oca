import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { InternshipsView } from './component/InternshipsView';

export const metadata = {
  title: 'OCA Internships Program – Old Columbans Association',
  description: 'Short placements with Columban-run firms, for boys at the School and young Columbans.',
};

// Edited in the admin panel (OCA Connect → OCA Internships Program).
export default async function InternshipsPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectInternships);
  return (
    <InteriorPage route="internships">
      <InternshipsView content={content} />
    </InteriorPage>
  );
}
