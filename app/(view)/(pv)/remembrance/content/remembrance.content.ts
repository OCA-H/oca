import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (OCA Connect → Remembrance). */
export const remembranceContent = {
  crumb: [{ label: 'OCA Connect' }, { label: 'Remembrance' }],
  tellUs: { label: 'Tell us of a passing', subject: 'Remembrance' },
  noteLead: 'Lost a batchmate or a master who taught you?',
  noteText: 'Write to the Secretariat with the name, the batch or the years they taught, and the date if you know it.',
  sendName: { label: 'Send a name', subject: 'Remembrance entry' },
  fund: { label: 'The Teachers Benevolent Fund', href: ROUTES.TEACHERS_BENEVOLENT_FUND },
};
