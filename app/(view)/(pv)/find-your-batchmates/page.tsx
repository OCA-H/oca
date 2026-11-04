import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { FindBatchmatesView } from './component/FindBatchmatesView';

export const metadata = {
  title: 'Find Your Batchmates – Old Columbans Association',
  description: 'Look up Columbans by batch, city and name in the OCA member directory.',
};

// Edited in the admin panel (Directory → Find Your Batchmates).
export default async function FindBatchmatesPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.directoryBatchmates);
  return (
    <InteriorPage route="find-your-batchmates">
      <FindBatchmatesView content={content} />
    </InteriorPage>
  );
}
