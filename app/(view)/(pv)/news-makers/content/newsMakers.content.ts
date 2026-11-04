import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (OCA Connect → News Makers). */
export const newsMakersContent = {
  crumb: [{ label: 'OCA Connect' }, { label: 'News Makers' }],
  readProfiles: 'Read the profiles',
  nominate: { label: 'Nominate a Columban', subject: 'News Maker nomination' },
  noteLead: 'Know a Columban who has made news, or spotted something that needs fixing?',
  nominateShort: 'Nominate someone',
  correction: { label: 'Report a correction', subject: 'Correction to a News Makers profile' },
  becomeMember: { label: 'Become a member', href: ROUTES.MEMBERSHIP },
  newsletters: { label: 'Read the newsletters', href: ROUTES.NEWSLETTERS },
};
