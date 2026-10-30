import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { getCommitteeContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { ExecutiveCommitteeView } from './component/ExecutiveCommitteeView';

export const metadata = {
  title: 'Executive Committee – Old Columbans Association',
  description: 'Executive Committee and leadership of the Old Columbans Association.',
};

// The current office bearers are edited in the admin panel (About → Executive Committee).
export default async function ExecutiveCommitteePage() {
  const committee = await getCommitteeContent();
  return (
    <>
      <Header activeRoute="executive-committee" />
      <main id="app">
        <div className="page is-active" id="page-executive-committee">
          <ExecutiveCommitteeView committee={committee} />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
