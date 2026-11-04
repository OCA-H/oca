import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Directory → Find Your Batchmates). */
export const findBatchmatesContent = {
  crumb: [{ label: 'Directory' }, { label: 'Find Your Batchmates' }],
  signInToSearch: { label: 'Sign in to search', href: `${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(`${ROUTES.FIND_YOUR_BATCHMATES}#search`)}` },
  becomeMember: { label: 'Become a member', href: ROUTES.MEMBERSHIP },
  updateDetails: { label: 'Update my details', href: ROUTES.PROFILE },
  writeSecretariat: 'Write to the Secretariat',
  form: {
    name: { label: 'Name', placeholder: 'First or last name' },
    batch: { label: 'Batch year', placeholder: 'e.g. 1995' },
    more: 'Add a city or profession',
    city: { label: 'City', placeholder: 'e.g. New Delhi' },
    profession: { label: 'Profession', placeholder: 'e.g. Architecture' },
    submit: 'Search the directory',
    noteSignedOut: 'You will be asked to sign in before results are shown.',
    noteSignedIn: 'Searching as a signed-in member.',
  },
  result: {
    lead: 'The online directory is opening soon. Until then, the Secretariat will look this up for you and put you in touch.',
    action: 'Send this search to the Secretariat',
    subject: 'Find my batchmates: directory search',
  },
  shownLabel: 'Shown by default',
  hiddenLabel: 'Hidden until you switch them on',
};
