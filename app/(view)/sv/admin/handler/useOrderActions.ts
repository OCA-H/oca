'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/app/(view)/common/services/api.service';
import type { Confirmed } from '../services';

export type OrderAction = 'resend' | 'reject';

/**
 * Resending a paid order's email, or rejecting an unpaid order, from a records list: which record
 * and action the dialog is open for, the reason typed for a rejection, and what the server said.
 * `onDone` gets the record as it now stands; the lists fetch their page again, since a rejected
 * order moves between the status counts.
 */
export function useOrderActions<T extends { orderId: string }>(
  resend: (orderId: string) => Promise<Confirmed<T>>,
  reject: (orderId: string, reason: string) => Promise<Confirmed<T>>,
  onDone: (record: T) => void
) {
  const [target, setTarget] = useState<{ action: OrderAction; record: T } | null>(null);
  const [reason, setReason] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const open = useCallback((action: OrderAction, record: T) => {
    setTarget({ action, record });
    setReason('');
    setError(null);
    setReasonError(null);
    setNotice(null);
  }, []);

  const cancel = useCallback(() => setTarget(null), []);

  const changeReason = useCallback((value: string) => {
    setReason(value);
    setReasonError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!target) return;
    setIsBusy(true);
    setError(null);
    try {
      const { orderId } = target.record;
      const result = target.action === 'resend' ? await resend(orderId) : await reject(orderId, reason.trim());
      onDone(result.data);
      setNotice(result.message);
      setTarget(null);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.fields?.reason) setReasonError(err.fields.reason);
      else setError(err instanceof Error ? err.message : 'That did not work. Please try again.');
    } finally {
      setIsBusy(false);
    }
  }, [onDone, reason, reject, resend, target]);

  return { target, reason, changeReason, isBusy, error, reasonError, notice, open, cancel, submit };
}

export type OrderActions<T extends { orderId: string }> = ReturnType<typeof useOrderActions<T>>;

export default useOrderActions;
