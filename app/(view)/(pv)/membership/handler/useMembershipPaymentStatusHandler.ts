'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { membershipService, type MembershipOrder } from '../services/membership.service';
import { formatPaymentDate, formatPaymentMode, formatRupees } from '../helper/membership.helper';

export type MembershipPaymentState = MembershipOrder['status'] | 'unknown';

export interface ReceiptRow {
  label: string;
  value: string;
}

/** Reads the order CCAvenue returned for (?order=...) and loads its saved payment result. */
export function useMembershipPaymentStatusHandler() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const responseFailed = searchParams.get('error') === '1';
  const [order, setOrder] = useState<MembershipOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(orderId));

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setOrder(await membershipService.getOrder(orderId));
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    membershipService.getOrder(orderId).then((result) => {
      if (!active) return;
      setOrder(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [orderId]);

  // A paid order stays paid even if a repeat response from the gateway errored.
  const state: MembershipPaymentState =
    order && (order.status === 'paid' || !responseFailed) ? order.status : 'unknown';
  const isPaid = state === 'paid';

  const receiptRows: ReceiptRow[] = [
    { label: 'Order reference', value: order?.orderId ?? orderId ?? '' },
    { label: 'CCAvenue reference', value: order?.trackingId ?? '' },
    { label: 'Bank reference', value: isPaid ? order?.bankRefNo ?? '' : '' },
    { label: 'Payment method', value: formatPaymentMode(order?.paymentMode ?? null) ?? '' },
    {
      label: isPaid ? 'Paid on' : 'Attempted on',
      value: formatPaymentDate(order?.paidAt ?? order?.updatedAt ?? null) ?? '',
    },
    { label: 'Member', value: order?.fullName ?? '' },
    { label: 'Email', value: order?.email ?? '' },
    { label: 'Membership', value: order ? `${order.membershipType} · one-time` : '' },
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
    amount: order ? formatRupees(order.amount) : null,
    refresh: loadOrder,
    printReceipt,
  };
}

export default useMembershipPaymentStatusHandler;
