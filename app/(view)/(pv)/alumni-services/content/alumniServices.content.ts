import type { ComingSoonConfig } from '@/app/(view)/common/component/ComingSoonLayout';
import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's buttons and links; its text is edited in the admin panel (OCA Connect → Alumni Services). */
export const alumniServicesContent: ComingSoonConfig = {
  crumb: [{ label: 'OCA Connect' }, { label: 'Alumni Services' }],
  heroActions: [
    { label: 'Become a member', href: ROUTES.MEMBERSHIP },
    { label: 'Ask the Secretariat', href: ROUTES.CONTACT },
  ],
  boxAction: { label: 'Write to the Secretariat', subject: 'Alumni Services' },
  meanwhile: [
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'Read the newsletters', href: ROUTES.NEWSLETTERS },
    { label: 'Become a member', href: ROUTES.MEMBERSHIP },
  ],
};
