import type { ComingSoonConfig } from '@/app/(view)/common/component/ComingSoonLayout';
import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's buttons and links; its text is edited in the admin panel (Directory → Worldwide Chapters). */
export const worldwideChaptersContent: ComingSoonConfig = {
  crumb: [{ label: 'Directory' }, { label: 'Worldwide Chapters & Office Bearers' }],
  tone: 'duo-navy',
  heroActions: [
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'Tell us about your chapter', subject: 'My OCA chapter' },
  ],
  boxAction: { label: 'Write to the Secretariat', subject: 'Starting an OCA chapter' },
  meanwhile: [
    { label: 'Find your batchmates', href: ROUTES.FIND_YOUR_BATCHMATES },
    { label: 'Become a member', href: ROUTES.MEMBERSHIP },
  ],
};
