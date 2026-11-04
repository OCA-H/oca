import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent, getSocialContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { getFundProgress } from '@/app/api/(features)/sv/contribution/services/fundProgress';
import { SocialConscienceView } from './component/SocialConscienceView';

export const metadata = {
  title: 'OCA Social Conscience – Old Columbans Association',
  description: 'The causes the Old Columbans Association supports: the Teachers Benevolent Fund and more.',
};

// The page's text is edited in the admin panel (About → OCA Social Conscience); the causes, their
// goals and live totals come from Home page → OCA Social Conscience and the paid contributions,
// so the home page and this page always agree.
export default async function SocialConsciencePage() {
  const [content, social, funds] = await Promise.all([
    getPageContent(PAGE_SECTION_KEYS.aboutSocialConscience),
    getSocialContent(),
    getFundProgress(),
  ]);
  return (
    <InteriorPage route="social-conscience">
      <SocialConscienceView content={content} causes={social.causes} funds={funds} />
    </InteriorPage>
  );
}
