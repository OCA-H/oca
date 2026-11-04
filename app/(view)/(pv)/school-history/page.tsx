import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { SchoolHistoryView } from './component/SchoolHistoryView';

export const metadata = {
  title: 'History of the School – Old Columbans Association',
  description: 'St. Columba’s School, New Delhi: founded in 1941 by the Christian Brothers, today among the premier schools of India.',
};

// Edited in the admin panel (Gallery → History of the School).
export default async function SchoolHistoryPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.galleryHistory);
  return (
    <InteriorPage route="school-history">
      <SchoolHistoryView content={content} />
    </InteriorPage>
  );
}
