import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { NetworkingView } from './component/NetworkingView';

export const metadata = {
  title: 'Networking – Old Columbans Association',
  description: 'Introductions between Columbans, made easy.',
};

// Edited in the admin panel (OCA Connect → Networking).
export default async function NetworkingPage() {
  const content = await getPageContent(PAGE_SECTION_KEYS.connectNetworking);
  return (
    <InteriorPage route="networking">
      <NetworkingView content={content} />
    </InteriorPage>
  );
}
