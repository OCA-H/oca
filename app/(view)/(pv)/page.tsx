import { HomeView } from '@/app/(view)/(pv)/home';
import { getHomeContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';

// The editable sections come from the database through a cached read, so the page still
// prerenders; saving a section in the admin panel refreshes it (see siteContentService).
export default async function RootPage() {
  return <HomeView content={await getHomeContent()} />;
}
