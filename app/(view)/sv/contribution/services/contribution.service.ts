/**
 * The payment result the status page shows. The server reads it from the signed link CCAvenue's
 * response redirects to; there is no API that reads contributions.
 */
export interface ContributionResult {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  fundLabel: string;
  units: number | null;
  unitLabel: string | null;
  wants80g: boolean;
  trackingId: string | null;
  paymentMode: string | null;
  message: string | null;
  at: string;
}
