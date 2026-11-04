import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (OCA Connect → Newsletters, and Home page → News & Notices). */
export const newslettersContent = {
  crumb: [{ label: 'OCA Connect' }, { label: 'Newsletters' }],
  readArchive: 'Read the archive',
  getByEmail: 'Get them by email',
  readNotice: 'Read notice',
  downloadPdf: 'Download PDF',
  defaultTag: 'NOTICE',
  writeTo: 'Write to',
  becomeMember: { label: 'Become a member', href: ROUTES.MEMBERSHIP },
  bylaws: { label: 'Read the ByLaws', href: ROUTES.BYLAWS },
  coverAlt: (title: string) => `OCA Newsletter, ${title}`,
  form: {
    name: { label: 'Name', placeholder: 'Your full name' },
    email: { label: 'Email address', placeholder: 'you@example.com' },
    batch: { label: 'Batch year', placeholder: 'e.g. 1995' },
    submit: 'Update my address',
    sending: 'Sending…',
    note: 'We will match this to your membership record before changing anything.',
  },
};
