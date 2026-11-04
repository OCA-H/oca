import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { PAGE_SECTION_KEYS } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { getGalleryContent, getPageContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { EventPhotographsView } from './component/EventPhotographsView';

export const metadata = {
  title: 'Event Photographs – Old Columbans Association',
  description: 'Photographs from the Annual Lunch, the sports field and the life of the Old Columbans Association.',
};

// The page's text is edited in the admin panel (Gallery → Photographs); the albums are the home
// page's (Home page → Our Gallery), so a photo added there shows on both pages.
export default async function EventPhotographsPage() {
  const [content, gallery] = await Promise.all([getPageContent(PAGE_SECTION_KEYS.galleryPhotographs), getGalleryContent()]);
  const albums = (gallery.albums ?? []).filter((album) => !/executive\s*committee/i.test(album.name));
  return (
    <InteriorPage route="event-photographs">
      <EventPhotographsView content={content} albums={albums} />
    </InteriorPage>
  );
}
