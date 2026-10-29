import { HomeView } from '@/app/(view)/(pv)/home';
import { getHomeContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { getTodaysBirthdays } from '@/app/api/(features)/(pview)/birthday/services/birthdayService';

// The editable sections come from the database through a cached read, so the page still
// prerenders; saving a section in the admin panel refreshes it (see siteContentService).
// Today's birthdays are cached the same way, until midnight in India (see birthdayService).
export default async function RootPage() {
  const [content, birthdays] = await Promise.all([getHomeContent(), getTodaysBirthdays()]);
  return <HomeView content={content} birthdays={birthdays} />;
}
