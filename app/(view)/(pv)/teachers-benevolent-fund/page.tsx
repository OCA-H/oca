import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getPageContent, getSocialContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { getFundProgress } from '@/app/api/(features)/sv/contribution/services/fundProgress';
import { TeachersFundView } from './component/TeachersFundView';
import { teachersFundHelper } from './helper';

export const metadata = {
  title: 'Teachers Benevolent Fund – Old Columbans Association',
  description: 'The OCA Teachers Benevolent Fund: support for the teachers of St. Columba’s School in their time of need.',
};

// The story, committee and rules are edited in the admin panel (About → Teachers Benevolent Fund).
// The figures are live: paid contributions to the fund (refreshed as each is paid), with the goal
// and offline gifts from the matching cause under Home page → OCA Social Conscience.
export default async function TeachersFundPage() {
  const [content, social, funds] = await Promise.all([
    getPageContent(PAGE_SECTION_KEYS.aboutTeachersFund),
    getSocialContent(),
    getFundProgress(),
  ]);
  const figures = teachersFundHelper.figures(content.fund, content.title, social.causes, funds);
  return (
    <InteriorPage route="teachers-benevolent-fund">
      <TeachersFundView content={content} figures={figures} />
    </InteriorPage>
  );
}
