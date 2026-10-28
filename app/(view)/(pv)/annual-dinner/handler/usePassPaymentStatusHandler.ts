'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { annualDinnerService, type PassOrder } from '../services/annualDinner.service';
import { formatPaymentDate, formatPaymentMode } from '@/app/(view)/(pv)/membership/helper/membership.helper';

export type PassPaymentState = PassOrder['status'] | 'unknown';

export interface PassReceiptRow {
  label: string;
  value: string;
}

/** Reads the order CCAvenue returned for (?order=...) and loads its saved payment result. */
export function usePassPaymentStatusHandler() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const responseFailed = searchParams.get('error') === '1';
  const [order, setOrder] = useState<PassOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(orderId));

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setOrder(await annualDinnerService.getOrder(orderId));
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    annualDinnerService.getOrder(orderId).then((result) => {
      if (!active) return;
      setOrder(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [orderId]);

  // A paid order stays paid even if a repeat response from the gateway errored.
  const state: PassPaymentState =
    order && (order.status === 'paid' || !responseFailed) ? order.status : 'unknown';
  const isPaid = state === 'paid';

  const receiptRows: PassReceiptRow[] = [
    { label: 'Order reference', value: order?.orderId ?? orderId ?? '' },
    { label: 'CCAvenue reference', value: order?.trackingId ?? '' },
    { label: 'Bank reference', value: isPaid ? order?.bankRefNo ?? '' : '' },
    { label: 'Payment method', value: formatPaymentMode(order?.paymentMode ?? null) ?? '' },
    {
      label: isPaid ? 'Paid on' : 'Attempted on',
      value: formatPaymentDate(order?.paidAt ?? order?.updatedAt ?? null) ?? '',
    },
    { label: 'Member', value: order ? `${order.fullName} (${order.memberId})` : '' },
    { label: 'Email', value: order?.email ?? '' },
    { label: 'Spouse', value: order?.spouseName ?? '' },
    { label: 'Reason', value: !isPaid && state !== 'cancelled' ? order?.message ?? '' : '' },
  ].filter((row) => row.value);

  const printReceipt = useCallback(() => window.print(), []);

  return {
    orderId,
    order,
    loading,
    state,
    isPaid,
    receiptRows,
    refresh: loadOrder,
    printReceipt,
  };
}

export default usePassPaymentStatusHandler;
