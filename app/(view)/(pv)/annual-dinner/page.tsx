import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { AnnualDinnerView } from './component/AnnualDinnerView';

export const metadata = {
  title: 'Annual Dinner Get Together – Old Columbans Association',
  description: 'OCA Annual Dinner Get Together event details and passes.',
};

export default function AnnualDinnerPage() {
  return (
    <>
      <Header activeRoute="annual-dinner" />
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
