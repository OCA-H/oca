import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Gallery → Photographs, and Home page → Our Gallery for the albums). */
export const eventPhotographsContent = {
  crumb: [{ label: 'Events' }, { label: 'Photographs' }],
  viewAlbums: 'View the albums',
  becomeMember: { label: 'Become a Member', href: ROUTES.MEMBERSHIP },
  support: { label: 'Support OCA', href: ROUTES.DONATION },
  allAlbums: 'All albums',
  filterAria: 'Filter by album',
  sharePhotos: 'Share your photos',
  shareSubject: 'Photos from an OCA gathering',
  viewer: { label: 'Photo viewer', close: 'Close', previous: 'Previous photo', next: 'Next photo' },
};
