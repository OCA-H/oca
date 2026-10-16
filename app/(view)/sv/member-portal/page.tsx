import { MemberPortalView } from '@/app/(view)/sv/member-portal';
import { Header, Footer, Lightbox } from '@/app/(view)/common';

export const metadata = {
  title: 'Member Portal – Old Columbans Association',
  description: 'Official member portal for verified Old Columbans Association alumni.',
};

export default function MemberPortalPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-member-portal">
          <MemberPortalView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
