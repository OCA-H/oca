import { ExecutiveCommitteeView } from '@/app/views/pview/executive-committee';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Executive Committee – Old Columbans Association',
  description: 'The leaders who guide OCA’s mission and strengthen the Columban community.',
};

export default function ExecutiveCommitteePage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-executive-committee">
          <ExecutiveCommitteeView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
