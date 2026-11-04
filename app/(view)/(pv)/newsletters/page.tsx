import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getNoticesContent, getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { NewslettersView } from './component/NewslettersView';

export const metadata = {
  title: 'Newsletters & Notices – Old Columbans Association',
  description: 'AGM notices, minutes, balance sheets and the OCA newsletter archive.',
};

// The newsletter archive is edited in the admin panel (OCA Connect → Newsletters); the latest
// notices are the home page's notice board (Home page → News & Notices), so a notice posted there
// shows here too.
export default async function NewslettersPage() {
  const [content, notices] = await Promise.all([getPageContent(PAGE_SECTION_KEYS.connectNewsletters), getNoticesContent()]);
  return (
    <InteriorPage route="newsletters">
      <NewslettersView content={content} notices={notices.items} />
    </InteriorPage>
  );
}
