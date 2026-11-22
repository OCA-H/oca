import { OcaAdminView } from './component/OcaAdminView';

export const metadata = {
  title: 'OCA admin – Old Columbans Association',
  robots: { index: false },
};

// Protected: proxy.ts sends signed-out visitors to member sign-in and anyone who is not a super
// admin or admin to their profile, and every /api/sv/oca-admin route checks the role in the
// database again. The console moves between its pages with the address's #hash, like the old portal.
export default function OcaAdminPage() {
  return <OcaAdminView />;
}
