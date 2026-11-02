import { Suspense } from 'react';
import { Header, Footer } from '@/app/(view)/common';
import { PassPaymentStatusView } from '@/app/(view)/(pv)/annual-dinner/component/PassPaymentStatusView';
import { GOLF_PASS_PAYMENT_STATUS_CONTENT } from '../content/golfPassPaymentStatus.content';

export const metadata = {
  title: 'Golf Tournament Payment – Old Columbans Association',
  description: 'The result of your OCA Golf Tournament pass payment.',
};

export default function GolfPassPaymentStatusPage() {
  return (
    <>
      <Header activeRoute="golf-tournament" />
      <main id="app">
        <div className="page is-active" id="page-golf-tournament-payment">
          {/* The view reads ?order= from the URL, which is only known in the browser. */}
          <Suspense fallback={null}>
            <PassPaymentStatusView content={GOLF_PASS_PAYMENT_STATUS_CONTENT} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
