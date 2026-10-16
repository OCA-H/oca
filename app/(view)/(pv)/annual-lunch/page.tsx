import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { AnnualLunchView } from './component/AnnualLunchView';

export const metadata = {
  title: 'Annual Lunch Get Together – Old Columbans Association',
  description: 'OCA Annual Lunch Get Together event details.',
};

export default function AnnualLunchPage() {
  return (
    <>
      <Header activeRoute="annual-lunch" />
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
