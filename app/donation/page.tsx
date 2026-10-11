import { DonationView } from '@/app/views/pview/donation';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Contribute – Old Columbans Association',
  description: 'Support the future of St. Columba’s and the Old Columbans Association initiatives.',
};

export default function DonationPage() {
  return (
    <>
      <Header />
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
