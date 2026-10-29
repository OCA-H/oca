import { donationContent } from '../content/donation.content';
import { redirectToCcAvenue, type CcAvenueCheckoutData } from '@/app/(view)/common/helper/ccavenue';
import { apiRequest } from '@/app/(view)/common/services/api.service';

export type DonationCheckoutData = CcAvenueCheckoutData;

/** A fund members can contribute to, from /api/sv/contribution/funds. */
export interface ContributionFund {
  code: string;
  label: string;
  note: string | null;
  /** Price per unit on a per-unit fund (₹5,000 per teacher); null when the member picks the amount. */
  unitAmount: number | null;
  unitLabel: string | null;
  maxUnits: number | null;
  /** The amount a member may choose, on a fund without a unit price. */
  minAmount: number;
  maxAmount: number;
  suspended: boolean;
}

export const donationService = {
  getContent() {
    return donationContent;
  },
  getPaymentOptions() {
    return donationContent.paymentOptions;
  },

  /** Signed-in members only. */
  getFunds: async (): Promise<ContributionFund[]> => {
    const json = await apiRequest<{ data: ContributionFund[] }>('/api/sv/contribution/funds');
    return json.data;
  },

  /** Signed-in members only. Stores the contribution (multipart, for the 80G documents). */
  checkout: async (form: FormData): Promise<DonationCheckoutData> => {
    const json = await apiRequest<{ data: DonationCheckoutData }>('/api/sv/contribution/checkout', {
      method: 'POST',
      body: form,
    });
    return json.data;
  },

  /** Sends the browser to CCAvenue with the encrypted order; the page navigates away. */
  redirectToGateway: redirectToCcAvenue,
};

export default donationService;
