import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; everything else is edited in the admin panel (About → Batch Coordinators). */
export const batchCoordinatorsContent = {
  crumb: [{ label: 'About OCA' }, { label: 'Batch Coordinators' }],
  callPrefix: 'Call',
  committee: { label: 'Meet the Executive Committee', href: ROUTES.EXECUTIVE_COMMITTEE },
  getInTouch: 'Get in touch with',
  at: 'at',
  callNow: 'Call now',
};
