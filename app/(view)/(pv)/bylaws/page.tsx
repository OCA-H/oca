import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { BylawsView } from './component/BylawsView';

export const metadata = {
  title: 'ByLaws – Old Columbans Association',
  description: 'The Memorandum of Constitution and the Rules and Regulations of the Old Columbans Association.',
};

// The page images and the PDF are uploaded in the admin panel (About → ByLaws of OCA).
export default async function BylawsPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.aboutBylaws);
  return (
    <InteriorPage route="bylaws">
      <BylawsView content={content} />
    </InteriorPage>
  );
}
