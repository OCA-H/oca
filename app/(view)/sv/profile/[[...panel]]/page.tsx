import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PROFILE_PANEL_SLUGS, ProfileView, profileContent, profileHelper } from '@/app/(view)/sv/profile';
import { ProfileSkeleton } from '@/app/(view)/sv/profile/component/subcomponents';
import { Header, Footer } from '@/app/(view)/common';

type ProfilePageProps = { params: Promise<{ panel?: string[] }> };

/** /sv/profile is the dashboard; /sv/profile/<slug> opens that panel. Anything else is a 404. */
async function panelFor(params: ProfilePageProps['params']) {
  const { panel: segments } = await params;
  const panel = segments && segments.length > 1 ? null : profileHelper.panelFromSlug(segments?.[0]);
  if (!panel) notFound();
  return panel;
}

// Every panel's address is known up front, so each one prerenders with its own pathname and
// title. Any other address renders on request, where panelFor turns it into a 404.
export function generateStaticParams() {
  return [{ panel: [] }, ...Object.values(PROFILE_PANEL_SLUGS).map((slug) => ({ panel: [slug] }))];
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
// The address is checked before anything streams, so an unknown one gets a real 404 status.
// ProfileView reads the pathname on the client, so it sits inside Suspense: with Partial
// Prefetching, Next.js also builds one shell for this route where the pathname is unknown.
export default async function ProfilePage({ params }: ProfilePageProps) {
  const panel = await panelFor(params);
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-members">
          <Suspense fallback={<ProfileSkeleton panel={panel} />}>
            <ProfileView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
