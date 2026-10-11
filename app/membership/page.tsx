import { MembershipView } from '@/app/views/pview/membership';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Membership – Old Columbans Association',
  description: 'Become a member of the Old Columbans Association.',
};

export default function MembershipPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-membership">
          <MembershipView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
