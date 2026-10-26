import { Suspense } from 'react';
import { Header, Footer } from '@/app/(view)/common';
import { ResetPasswordView } from '../component/ResetPasswordView';

export const metadata = {
  title: 'Reset Password – Old Columbans Association',
  description: 'Choose a new password for your Old Columbans Association member account.',
};

export default function ResetPasswordPage() {
  return (
    <>
      <Header activeRoute="membership" />
      <main id="app">
        <div className="page is-active" id="page-reset-password">
          {/* The view reads ?token= from the emailed link, which is only known in the browser. */}
          <Suspense fallback={null}>
            <ResetPasswordView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
