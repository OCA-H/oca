import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { SportsView } from './component/SportsView';

export const metadata = {
  title: 'OCA Sports – Old Columbans Association',
  description: 'OCA Sports fixtures, leagues, and tournaments.',
};

export default function SportsPage() {
  return (
    <>
      <Header activeRoute="sports" />
      <main id="app">
        <div className="page is-active" id="page-sports">
          <SportsView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
