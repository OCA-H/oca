import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SECTION_SPECS } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { AdminView, adminHelper } from '@/app/(view)/sv/admin';
import { AdminSkeleton } from '@/app/(view)/sv/admin/component/subcomponents';
import { Header, Footer } from '@/app/(view)/common';

type AdminPageProps = { params: Promise<{ panel?: string[] }> };

/** /sv/admin is the dashboard; /sv/admin/home/events opens that section's editor. Anything else is not found. */
async function panelFor(params: AdminPageProps['params']) {
  const panel = adminHelper.panelFromSegments((await params).panel);
  if (!panel) notFound();
  return panel;
}

// Every panel's address is known up front, so each one prerenders with its own title.
export function generateStaticParams() {
  return adminHelper.allPanelSegments().map((panel) => ({ panel }));
}

export async function generateMetadata({ params }: AdminPageProps) {
  const panel = await panelFor(params);
  const section = SECTION_SPECS.find((spec) => spec.key === panel)?.label;
  return {
    title: `${section ? `${section} – ` : ''}Admin Panel – Old Columbans Association`,
    robots: { index: false },
  };
}

/** Everything that depends on the address, so it stays inside Suspense. */
async function AdminPanelPage({ params }: AdminPageProps) {
  await panelFor(params);
  return <AdminView />;
}

// Protected: proxy.ts sends signed-out visitors to member sign-in and non-admins to their
// profile, and every /api/sv/admin route checks the admin role in the database again.
export default function AdminPage({ params }: AdminPageProps) {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-admin">
          <Suspense fallback={<AdminSkeleton />}>
            <AdminPanelPage params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
