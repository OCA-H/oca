import { Suspense } from 'react';
import { Header, Footer } from '@/app/(view)/common';
import { MembershipPaymentStatusView } from '../component/MembershipPaymentStatusView';

export const metadata = {
  title: 'Membership Payment – Old Columbans Association',
  description: 'The result of your Old Columbans Association membership payment.',
};

export default function MembershipPaymentStatusPage() {
  return (
    <>
      <Header activeRoute="membership" />
      <main id="app">
        <div className="page is-active" id="page-membership-payment">
          {/* The view reads ?order= from the URL, which is only known in the browser. */}
          <Suspense fallback={null}>
            <MembershipPaymentStatusView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
