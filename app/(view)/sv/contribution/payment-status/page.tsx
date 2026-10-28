import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Header, Footer } from '@/app/(view)/common';
import { ContributionService } from '@/app/api/(features)/sv/contribution/services/contributionService';
import { ContributionPaymentStatusView } from '../component/ContributionPaymentStatusView';

export const metadata = {
  title: 'Contribution Payment – Old Columbans Association',
  description: 'The result of your contribution to the Old Columbans Association.',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * CCAvenue's response redirects here with a signed result (?r=), checked on the server and shown
 * only to the member it belongs to. proxy.ts signs members in before they reach /sv pages and
 * sets x-user-id from the verified session.
 */
async function ContributionPaymentResult({ searchParams }: { searchParams: SearchParams }) {
  const [{ r, order }, requestHeaders] = await Promise.all([searchParams, headers()]);
  const userId = Number(requestHeaders.get('x-user-id'));
  const result = typeof r === 'string' && userId ? await ContributionService.readResult(r, userId) : null;
  return (
    <ContributionPaymentStatusView result={result} orderRef={typeof order === 'string' ? order : null} />
  );
}

export default function ContributionPaymentStatusPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Header activeRoute="donation" />
      <main id="app">
        <div className="page is-active" id="page-contribution-payment">
          <Suspense fallback={null}>
            <ContributionPaymentResult searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
