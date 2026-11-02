import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getGolfContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { getPassPrices } from '@/app/api/(features)/(pview)/event-pass/services/passPrices';
import { GolfTournamentView } from './component/GolfTournamentView';
import { GOLF_EVENT } from './content/golfTournament.content';
import { golfGlancePrices } from './helper/golfTournament.helper';

export const metadata = {
  title: 'OCA Golf Tournament – Old Columbans Association',
  description: 'OCA Golf Tournament event details and passes. Every pass includes entry to the OCA Annual Dinner.',
};

// The banner, key facts and pass heading are edited in the admin panel (Events → Golf Tournament);
// the prices in "Your pass at a glance" follow the passes (Passes → Golf passes & seats).
export default async function GolfTournamentPage() {
  const [content, passes] = await Promise.all([getGolfContent(), getPassPrices(GOLF_EVENT)]);
  return (
    <>
      <Header activeRoute="golf-tournament" />
      <main id="app">
        <div className="page is-active" id="page-golf-tournament">
          <GolfTournamentView content={content} prices={golfGlancePrices(passes)} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
