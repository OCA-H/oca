import { Header, Footer, Lightbox } from '@/app/(view)/common';
import { VisionMissionView } from './component/VisionMissionView';

export const metadata = {
  title: 'Vision & Mission – Old Columbans Association',
  description: 'Vision, mission, and objectives of the Old Columbans Association.',
};

export default function VisionMissionPage() {
  return (
    <>
      <Header activeRoute="vision-mission" />
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
