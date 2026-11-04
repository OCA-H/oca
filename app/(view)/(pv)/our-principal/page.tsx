import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { OurPrincipalView } from './component/OurPrincipalView';

export const metadata = {
  title: 'About Our Principal – Old Columbans Association',
  description: 'The Principal of St. Columba’s School and Patron of the Old Columbans Association.',
};

// Edited in the admin panel (Gallery → School Principal).
export default async function OurPrincipalPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.galleryPrincipal);
  return (
    <InteriorPage route="our-principal">
      <OurPrincipalView content={content} />
    </InteriorPage>
  );
}
