import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { SchoolMagazineView } from './component/SchoolMagazineView';

export const metadata = {
  title: 'The Columban – School Magazine – Old Columbans Association',
  description: 'Six decades of St. Columba’s School in the School’s own words: every edition of The Columban, from 1962.',
};

// The editions (covers and PDFs) are edited in the admin panel (Gallery → School Magazine).
export default async function SchoolMagazinePage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.galleryMagazine);
  return (
    <InteriorPage route="school-magazine">
      <SchoolMagazineView content={content} />
    </InteriorPage>
  );
}
