import { redirectToCcAvenue, type CcAvenueCheckoutData } from '@/app/(view)/common/helper/ccavenue';

export interface ApiEventPass {
  id: number;
  eventName: string;
  passId: string;
  tierGroup: string;
  tierTitle: string;
  title: string;
  label: string;
  description: string | null;
  batchEligibility: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  totalQuantity: number | null;
  availableQuantity: number | null;
  includesSpouse: boolean;
  allowsChildren: boolean;
  allowsTeacherSponsorship: boolean;
  status: string;
  statusNote: string | null;
  displayOrder: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PassCheckoutRequest {
  eventName: string;
  passId: string;
  teachers: number;
  spouseName?: string;
  under12: number;
  above12: number;
}

export interface PassOrder {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  eventName: string;
  passLabel: string;
  lineItems: { label: string; amount: number }[];
  amount: number;
  currency: string;
  fullName: string;
  firstName: string;
  memberId: string;
  email: string;
  spouseName: string | null;
  trackingId: string | null;
  bankRefNo: string | null;
  paymentMode: string | null;
  message: string | null;
  paidAt: string | null;
  updatedAt: string;
}

export class PassCheckoutError extends Error {
  constructor(message: string, readonly fields?: Record<string, string>) {
    super(message);
    this.name = 'PassCheckoutError';
  }
}

export const annualDinnerService = {
  getPasses: async (eventName: string = 'annual-dinner'): Promise<ApiEventPass[]> => {
    try {
      const response = await fetch(`/api/event-pass?eventName=${encodeURIComponent(eventName)}`);
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  /** Prices and stores the booking on the server; returns what the browser posts to CCAvenue. */
  checkout: async (request: PassCheckoutRequest): Promise<CcAvenueCheckoutData> => {
    const res = await fetch('/api/event-pass/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      throw new PassCheckoutError(json?.error || 'We could not start the payment. Please try again.', json?.fields);
    }
    return json.data as CcAvenueCheckoutData;
  },

  /** Sends the browser to CCAvenue with the encrypted order; the page navigates away. */
  redirectToGateway: redirectToCcAvenue,

  getOrder: async (orderId: string): Promise<PassOrder | null> => {
    try {
      const res = await fetch(`/api/event-pass/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' });
      const json = await res.json().catch(() => null);
      return res.ok && json?.ok ? (json.data as PassOrder) : null;
    } catch {
      return null;
    }
  },
};
