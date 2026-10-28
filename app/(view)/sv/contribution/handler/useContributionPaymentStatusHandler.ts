'use client';

import { useCallback } from 'react';
import { formatPaymentDate, formatPaymentMode, formatRupees } from '@/app/(view)/(pv)/membership/helper/membership.helper';
import type { ContributionResult } from '../services/contribution.service';

export type ContributionPaymentState = 'paid' | 'failed' | 'cancelled' | 'unknown';

export interface ContributionReceiptRow {
  label: string;
  value: string;
}

/**
 * Turns the verified result of CCAvenue's response into what the status page shows. `result` is
 * null when the link was altered, has expired, belongs to another member, or the response failed.
 */
export function useContributionPaymentStatusHandler(result: ContributionResult | null, orderRef: string | null) {
  const state: ContributionPaymentState = result && result.status !== 'pending' ? result.status : 'unknown';
  const isPaid = state === 'paid';

  const receiptRows: ContributionReceiptRow[] = [
    { label: 'Order reference', value: result?.orderId ?? orderRef ?? '' },
    { label: 'CCAvenue reference', value: result?.trackingId ?? '' },
    { label: 'Payment method', value: formatPaymentMode(result?.paymentMode ?? null) ?? '' },
    { label: isPaid ? 'Paid on' : 'Attempted on', value: formatPaymentDate(result?.at ?? null) ?? '' },
    { label: 'Reason', value: !isPaid && state !== 'cancelled' ? result?.message ?? '' : '' },
  ].filter((row) => row.value);

  const lineLabel = result
    ? result.units
      ? `${result.fundLabel} · ${result.units} ${result.unitLabel ?? 'unit'}${result.units > 1 ? 's' : ''}`
      : result.fundLabel
    : null;

  const printReceipt = useCallback(() => window.print(), []);

  return {
    state,
    isPaid,
    receiptRows,
    lineLabel,
    amount: result ? formatRupees(result.amount) : null,
    orderId: result?.orderId ?? orderRef,
    printReceipt,
  };
}

export default useContributionPaymentStatusHandler;
