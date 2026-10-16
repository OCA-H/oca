import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { ExecutiveCommitteeView } from './component/ExecutiveCommitteeView';

export const metadata = {
  title: 'Executive Committee – Old Columbans Association',
  description: 'Executive Committee and leadership of the Old Columbans Association.',
};

export default function ExecutiveCommitteePage() {
  return (
    <>
      <Header activeRoute="executive-committee" />
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
