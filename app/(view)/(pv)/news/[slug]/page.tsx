import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InteriorPage } from '@/app/(view)/common/component/InteriorPage';
import { getNoticesContent } from '@/app/api/(features)/(pview)/site/services/siteContentService';
import { NewsDetailSkeleton, NewsDetailView } from '../component';
import { newsContent as text } from '../content';
import { findNotice, noticeSlugs } from '../helper';

// A notice from the home page's notice board (Home page → News & Notices in the admin panel), on
// its own page. The notices come through the cached site-content read, so a save in the admin
// panel refreshes these pages too; notices added after the build are rendered on first visit.
// The slug is URL data: it is read inside <Suspense>, so a click on a notice shows the page's
// frame and banner at once while the notice itself streams in.

export async function generateStaticParams() {
  const { items } = await getNoticesContent();
  return noticeSlugs(items).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/news/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const notice = findNotice((await getNoticesContent()).items, slug);
  if (!notice) return { title: `${text.section} – ${text.siteName}` };
  return {
    title: `${notice.title} – ${text.siteName}`,
    description: notice.summary || undefined,
  };
}

export default function NewsItemPage({ params }: PageProps<'/news/[slug]'>) {
  return (
    <InteriorPage route="news-item">
      <Suspense fallback={<NewsDetailSkeleton />}>
        <NewsItem params={params} />
      </Suspense>
    </InteriorPage>
  );
}

async function NewsItem({ params }: { params: PageProps<'/news/[slug]'>['params'] }) {
  const { slug } = await params;
  const notice = findNotice((await getNoticesContent()).items, slug);
  if (!notice) notFound();
  return <NewsDetailView notice={notice} />;
}
