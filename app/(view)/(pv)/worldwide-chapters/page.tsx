import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { WorldwideChaptersView } from './component/WorldwideChaptersView';

export const metadata = {
  title: 'Worldwide Chapters & Office Bearers – Old Columbans Association',
  description: 'Where Columbans have settled around the world, and who leads each OCA chapter.',
};

// Edited in the admin panel (Directory → Worldwide Chapters).
export default async function WorldwideChaptersPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.directoryChapters);
  return (
    <InteriorPage route="worldwide-chapters">
      <WorldwideChaptersView content={content} />
    </InteriorPage>
  );
}
