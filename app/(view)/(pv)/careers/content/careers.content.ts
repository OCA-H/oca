import type { ComingSoonConfig } from '@/app/(view)/common/component/ComingSoonLayout';
import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's buttons and links; its text is edited in the admin panel (OCA Connect → Careers). */
export const careersContent: ComingSoonConfig = {
  crumb: [{ label: 'OCA Connect' }, { label: 'Careers' }],
  heroActions: [
    { label: 'Write to the Secretariat', subject: 'OCA Careers' },
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
  ],
  boxAction: { label: 'Write to the Secretariat', subject: 'Careers' },
  meanwhile: [
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'OCA Internships Program', href: ROUTES.INTERNSHIPS },
  ],
};
