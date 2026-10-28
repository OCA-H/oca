import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PROFILE_PANEL_SLUGS, ProfileView, profileContent, profileHelper } from '@/app/(view)/sv/profile';
import { ProfileSkeleton } from '@/app/(view)/sv/profile/component/subcomponents';
import { Header, Footer } from '@/app/(view)/common';

type ProfilePageProps = { params: Promise<{ panel?: string[] }> };

/** /sv/profile is the dashboard; /sv/profile/<slug> opens that panel. Anything else is not found. */
async function panelFor(params: ProfilePageProps['params']) {
  const { panel: segments } = await params;
  const panel = segments && segments.length > 1 ? null : profileHelper.panelFromSlug(segments?.[0]);
  if (!panel) notFound();
  return panel;
}

// Every panel's address is known up front, so each one prerenders with its own pathname and
// title. Any other address renders on request, where panelFor shows the not-found page.
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

/** Everything that depends on the address, so it stays inside Suspense. */
async function ProfilePanel({ params }: ProfilePageProps) {
  await panelFor(params);
  return <ProfileView />;
}

// Protected: proxy.ts sends signed-out visitors of /sv/* to member sign-in, and every
// /api/sv/profile route checks the session again before reading or writing data.
// The address (params here, the pathname in ProfileView) is only read inside Suspense, so the
// header, layout and skeleton show at once on navigation instead of waiting on the server.
// The cost: an unknown address shows the not-found page with status 200 rather than 404,
// which does not matter for pages that need a sign-in and are never indexed.
export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-members">
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfilePanel params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
