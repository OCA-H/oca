import { Suspense } from 'react';
import { Header, Footer } from '@/app/(view)/common';
import { PassPaymentStatusView } from '../component/PassPaymentStatusView';

export const metadata = {
  title: 'Annual Dinner Payment – Old Columbans Association',
  description: 'The result of your OCA Annual Dinner pass payment.',
};

export default function PassPaymentStatusPage() {
  return (
    <>
      <Header activeRoute="annual-dinner" />
      <main id="app">
        <div className="page is-active" id="page-annual-dinner-payment">
          {/* The view reads ?order= from the URL, which is only known in the browser. */}
          <Suspense fallback={null}>
            <PassPaymentStatusView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
