import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { BatchCoordinatorsView } from './component/BatchCoordinatorsView';

export const metadata = {
  title: 'Batch Coordinators – Old Columbans Association',
  description: 'Represent your batch: the OCA is looking for well-networked Columbans to act as Batch Coordinators.',
};

// Edited in the admin panel (About → Batch Coordinators).
export default async function BatchCoordinatorsPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.aboutBatchCoordinators);
  return (
    <InteriorPage route="batch-coordinators">
      <BatchCoordinatorsView content={content} />
    </InteriorPage>
  );
}
