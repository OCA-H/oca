import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Gallery → School Magazine). */
export const schoolMagazineContent = {
  crumb: [{ label: 'Events' }, { label: 'School Magazine' }],
  browse: 'Browse the archive',
  becomeMember: { label: 'Become a Member', href: ROUTES.MEMBERSHIP },
  support: { label: 'Support OCA', href: ROUTES.DONATION },
  signIn: { label: 'Sign in', href: ROUTES.MEMBER_SIGNIN },
  becomeMemberLower: 'become a member',
  readMagazine: 'Read Magazine →',
  filterAria: 'Filter by decade',
  coverAlt: (year: string) => `The Columban magazine, ${year}`,
};
