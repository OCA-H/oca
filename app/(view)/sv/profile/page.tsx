import { ProfileView } from '@/app/(view)/sv/profile';
import { Header, Footer } from '@/app/(view)/common';

export const metadata = {
  title: 'Members Area – Old Columbans Association',
  description: 'Your Old Columbans Association membership: account, e-membership card, donor pass and more.',
};

// Protected: proxy.ts sends signed-out visitors of /sv/* to member sign-in, and every
// /api/sv/profile route checks the session again before reading or writing data.
export default function ProfilePage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-members">
          <ProfileView />
        </div>
      </main>
      <Footer />
    </>
  );
}
