import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getLunchContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { AnnualLunchView } from './component/AnnualLunchView';

export const metadata = {
  title: 'Annual Lunch Get Together – Old Columbans Association',
  description: 'OCA Annual Lunch Get Together event details.',
};

// The banner and key facts are edited in the admin panel (Events → Annual Lunch).
export default async function AnnualLunchPage() {
  const content = await getLunchContent();
  return (
    <>
      <Header activeRoute="annual-lunch" />
      <main id="app">
        <div className="page is-active" id="page-annual-lunch">
          <AnnualLunchView content={content} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
