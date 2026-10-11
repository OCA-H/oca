import { VisionMissionView } from '@/app/views/pview/vision-mission';
import { Header, Footer, Lightbox } from '@/app/views/common';

export const metadata = {
  title: 'Vision & Mission – Old Columbans Association',
  description: 'Our mission is to praise, promote and protect St. Columba’s School and its students.',
};

export default function VisionMissionPage() {
  return (
    <>
      <Header />
      <main id="app">
        <div className="page is-active" id="page-vision-mission">
          <VisionMissionView />
        </div>
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
