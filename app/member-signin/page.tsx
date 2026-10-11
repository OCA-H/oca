import { MemberSignInView } from '@/app/views/pview/member-signin';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'OCA Member Login – Old Columbans Association',
  description: 'Member sign in for the Old Columbans Association community portal.',
};

export default function MemberSignInPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-member-signin">
          <MemberSignInView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
