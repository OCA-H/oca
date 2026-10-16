import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { DonationView } from './component/DonationView';

export const metadata = {
  title: 'Contribute & Support – Old Columbans Association',
  description: 'Support the Old Columbans Association initiatives and welfare programs.',
};

export default function DonationPage() {
  return (
    <>
      <Header activeRoute="donation" />
      <main id="app">
        <div className="page is-active" id="page-donation">
          <DonationView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
