import { SportsView } from '@/app/views/pview/sports';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'OCA Sports – Old Columbans Association',
  description: 'Interschool and alumni cricket tournaments and sporting events.',
};

export default function SportsPage() {
  return (
    <>
      <Header />
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
