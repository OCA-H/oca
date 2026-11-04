import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Gallery → History of the School). */
export const schoolHistoryContent = {
  crumb: [{ label: 'Events' }, { label: 'History of the School' }],
  join: { label: 'Join the Old Columbans', href: ROUTES.MEMBERSHIP },
  visitSchool: 'Visit the school website',
  becomeMember: { label: 'Become a Member', href: ROUTES.MEMBERSHIP },
  support: { label: 'Support OCA', href: ROUTES.DONATION },
};
