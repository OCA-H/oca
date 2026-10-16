import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { MembershipView } from './component/MembershipView';

export const metadata = {
  title: 'Membership – Old Columbans Association',
  description: 'Become a member of the Old Columbans Association.',
};

export default function MembershipPage() {
  return (
    <>
      <Header activeRoute="membership" />
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
