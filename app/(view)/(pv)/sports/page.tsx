import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getSportsContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { SportsView } from './component/SportsView';

export const metadata = {
  title: 'OCA Sports – Old Columbans Association',
  description: 'OCA Sports fixtures, leagues, and tournaments.',
};

// The banner, key facts and sponsorship appeal are edited in the admin panel (Events → OCA Sports).
export default async function SportsPage() {
  const content = await getSportsContent();
  return (
    <>
      <Header activeRoute="sports" />
      <main id="app">
        <div className="page is-active" id="page-sports">
          <SportsView content={content} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
