import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { PartnerOrganizationView } from './component/PartnerOrganizationView';

export const metadata = {
  title: 'Partner Organization Login – Old Columbans Association',
  description: 'Partner Organization login for the Old Columbans Association community portal.',
};

export default function PartnerOrganizationPage() {
  return (
    <>
      <Header activeRoute="membership" />
      <main id="app">
        <div className="page is-active" id="page-partner-organization">
          <PartnerOrganizationView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
