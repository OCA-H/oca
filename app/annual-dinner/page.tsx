import { AnnualDinnerView } from '@/app/views/pview/annual-dinner';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Annual Dinner Get Together – Old Columbans Association',
  description: 'OCA Annual Dinner Get Together at Qutub Golf Course.',
};

export default function AnnualDinnerPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-annual-dinner">
          <AnnualDinnerView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
