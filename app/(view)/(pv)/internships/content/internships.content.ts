import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (OCA Connect → OCA Internships Program). */
export const internshipsContent = {
  crumb: [{ label: 'OCA Connect' }, { label: 'OCA Internships Program' }],
  offer: { label: 'Offer a placement', subject: 'Offering an OCA internship' },
  apply: { label: 'Apply', subject: 'Applying for an OCA internship' },
  applyLong: 'Apply for a placement',
  careers: { label: 'See Careers', href: ROUTES.CAREERS },
  talkFirst: { label: 'Talk to us first', href: ROUTES.CONTACT },
};
