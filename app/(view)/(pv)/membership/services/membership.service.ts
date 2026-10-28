import { redirectToCcAvenue, type CcAvenueCheckoutData } from '@/app/(view)/common/helper/ccavenue';

export type MembershipCheckoutData = CcAvenueCheckoutData;

export interface MembershipOrder {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  membershipType: string;
  firstName: string;
  fullName: string;
  email: string;
  trackingId: string | null;
  bankRefNo: string | null;
  paymentMode: string | null;
  message: string | null;
  paidAt: string | null;
  updatedAt: string;
}

export class MembershipCheckoutError extends Error {
  constructor(message: string, readonly fields?: Record<string, string>) {
    super(message);
    this.name = 'MembershipCheckoutError';
  }
}

export const membershipService = {
  checkout: async (application: object): Promise<MembershipCheckoutData> => {
    const res = await fetch('/api/membership/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      throw new MembershipCheckoutError(
        json?.error || 'We could not start the payment. Please try again.',
        json?.fields
      );
    }
    return json.data as MembershipCheckoutData;
  },

  /** Sends the browser to CCAvenue with the encrypted order; the page navigates away. */
  redirectToGateway: redirectToCcAvenue,

  getOrder: async (orderId: string): Promise<MembershipOrder | null> => {
    try {
      const res = await fetch(`/api/membership/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' });
      const json = await res.json().catch(() => null);
      return res.ok && json?.ok ? (json.data as MembershipOrder) : null;
    } catch {
      return null;
    }
  },
};
