import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Gallery → School Principal). */
export const ourPrincipalContent = {
  crumb: [{ label: 'The School' }, { label: 'About Our Principal' }],
  readStory: 'Read his story',
  patron: { label: 'Patron of the Association', href: ROUTES.EXECUTIVE_COMMITTEE },
  viewCommittee: { label: 'View the Committee', href: ROUTES.EXECUTIVE_COMMITTEE },
  timelineAria: 'Journey at a glance',
};
