import { notFound } from 'next/navigation';
import { ProfileView, profileContent, profileHelper } from '@/app/(view)/sv/profile';
import { Header, Footer } from '@/app/(view)/common';

type ProfilePageProps = { params: Promise<{ panel?: string[] }> };

/** /sv/profile is the dashboard; /sv/profile/<slug> opens that panel. Anything else is a 404. */
async function panelFor(params: ProfilePageProps['params']) {
  const { panel: segments } = await params;
  const panel = segments && segments.length > 1 ? null : profileHelper.panelFromSlug(segments?.[0]);
  if (!panel) notFound();
  return panel;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const panel = await panelFor(params);
  const section = panel === 'dashboard' ? null : profileContent[panel].title;
  return {
    title: `${section ? `${section} – ` : ''}Members Area – Old Columbans Association`,
    description: 'Your Old Columbans Association membership: account, e-membership card, donor pass and more.',
  };
}

// Protected: proxy.ts sends signed-out visitors of /sv/* to member sign-in, and every
// /api/sv/profile route checks the session again before reading or writing data.
export default async function ProfilePage({ params }: ProfilePageProps) {
  await panelFor(params);
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
