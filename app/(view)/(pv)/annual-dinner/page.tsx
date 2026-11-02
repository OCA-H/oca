import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getDinnerContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { getPassPrices } from '@/app/api/(features)/(pview)/event-pass/services/passPrices';
import { AnnualDinnerView } from './component/AnnualDinnerView';
import { dinnerGlance } from './helper/annualDinner.helper';

export const metadata = {
  title: 'Annual Dinner Get Together – Old Columbans Association',
  description: 'OCA Annual Dinner Get Together event details and passes.',
};

// The banner, key facts and pass heading are edited in the admin panel (Events → Annual Dinner);
// the prices in "Passes at a glance" follow the passes (Passes → Dinner passes & seats).
export default async function AnnualDinnerPage() {
  const [content, passes] = await Promise.all([getDinnerContent(), getPassPrices('annual-dinner')]);
  return (
    <>
      <Header activeRoute="annual-dinner" />
      <main id="app">
        <div className="page is-active" id="page-annual-dinner">
          <AnnualDinnerView content={content} glance={dinnerGlance(passes)} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
