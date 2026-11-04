import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (About → OCA Social Conscience). */
export const socialConscienceContent = {
  crumb: [{ label: 'About OCA' }, { label: 'OCA Social Conscience' }],
  seeCauses: 'See the causes',
  contribute: { label: 'Contribute', href: ROUTES.DONATION },
  donated: (progress: number) => `${progress}% Donated`,
  goal: 'Goal :',
  donate: 'Donate Now',
  readMore: 'Read more',
  contributeNow: 'Contribute Now',
};
