import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { NewsMakersView } from './component/NewsMakersView';

export const metadata = {
  title: 'News Makers – Old Columbans Association',
  description: 'Columbans who have made their mark in law, diplomacy, journalism and the classroom.',
};

// The profiles are edited in the admin panel (OCA Connect → News Makers).
export default async function NewsMakersPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectNewsMakers);
  return (
    <InteriorPage route="news-makers">
      <NewsMakersView content={content} />
    </InteriorPage>
  );
}
