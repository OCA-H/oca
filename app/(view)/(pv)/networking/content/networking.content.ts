import type { ComingSoonConfig } from '@/app/(view)/common/component/ComingSoonLayout';
import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's buttons and links; its text is edited in the admin panel (OCA Connect → Networking). */
export const networkingContent: ComingSoonConfig = {
  crumb: [{ label: 'OCA Connect' }, { label: 'Networking' }],
  heroActions: [
    { label: 'Find a Columban', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'Ask for an introduction', subject: 'Networking introduction' },
  ],
  boxAction: { label: 'Write to the Secretariat', subject: 'Networking introduction' },
  meanwhile: [
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'Careers', href: ROUTES.CAREERS },
  ],
};
