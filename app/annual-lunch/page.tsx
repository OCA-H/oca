import { AnnualLunchView } from '@/app/views/pview/annual-lunch';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Annual Lunch Get Together – Old Columbans Association',
  description: 'OCA Annual Lunch Get Together flagship gathering for Columbans.',
};

export default function AnnualLunchPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-annual-lunch">
          <AnnualLunchView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
