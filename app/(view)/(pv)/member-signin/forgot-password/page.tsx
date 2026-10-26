import { Header, Footer } from '@/app/(view)/common';
import { ForgotPasswordView } from '../component/ForgotPasswordView';

export const metadata = {
  title: 'Forgot Password – Old Columbans Association',
  description: 'Reset the password for your Old Columbans Association member account.',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Header activeRoute="membership" />
      <main id="app">
        <div className="page is-active" id="page-forgot-password">
          <ForgotPasswordView />
        </div>
      </main>
      <Footer />
    </>
  );
}
