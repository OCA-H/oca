import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getMembershipFee } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { MembershipView } from './component/MembershipView';

export const metadata = {
  title: 'Membership – Old Columbans Association',
  description: 'Become a member of the Old Columbans Association.',
};

// The fee is set in the admin panel (Membership → Membership fee).
export default async function MembershipPage() {
  const fee = await getMembershipFee();
  return (
    <>
      <Header activeRoute="membership" />
      <main id="app">
        <div className="page is-active" id="page-membership">
          <MembershipView fee={fee} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
