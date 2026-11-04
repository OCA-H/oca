import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { SchoolAnthemView } from './component/SchoolAnthemView';

export const metadata = {
  title: 'School Anthem – Old Columbans Association',
  description: 'The St. Columba’s School Anthem: watch it, read the words, and download the audio.',
};

// Edited in the admin panel (Gallery → School Anthem); the motto comes from Gallery → History of the School.
export default async function SchoolAnthemPage() {
  const [content, history] = await Promise.all([
    getPageContent(PAGE_SECTION_KEYS.galleryAnthem),
    getPageContent(PAGE_SECTION_KEYS.galleryHistory),
  ]);
  return (
    <InteriorPage route="school-anthem">
      <SchoolAnthemView content={content} motto={history} />
    </InteriorPage>
  );
}
