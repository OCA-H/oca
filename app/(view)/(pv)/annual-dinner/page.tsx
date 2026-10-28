import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getDinnerContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { AnnualDinnerView } from './component/AnnualDinnerView';

export const metadata = {
  title: 'Annual Dinner Get Together – Old Columbans Association',
  description: 'OCA Annual Dinner Get Together event details and passes.',
};

// The banner, key facts and pass heading are edited in the admin panel (Events → Annual Dinner).
export default async function AnnualDinnerPage() {
  const content = await getDinnerContent();
  return (
    <>
      <Header activeRoute="annual-dinner" />
      <main id="app">
        <div className="page is-active" id="page-annual-dinner">
          <AnnualDinnerView content={content} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
