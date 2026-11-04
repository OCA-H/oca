import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { AlumniServicesView } from './component/AlumniServicesView';

export const metadata = {
  title: 'Alumni Services – Old Columbans Association',
  description: 'Mentoring, member offers and services run by Columbans for Columbans.',
};

// Edited in the admin panel (OCA Connect → Alumni Services).
export default async function AlumniServicesPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectAlumniServices);
  return (
    <InteriorPage route="alumni-services">
      <AlumniServicesView content={content} />
    </InteriorPage>
  );
}
