'use client';

import { useCallback, useState } from 'react';
import { ApiError } from '@/app/(view)/common/services/api.service';
import type { Confirmed } from '../services';

/**
 * Confirming a payment by hand from a records list: which record the dialog is open for, the
 * CCAvenue reference typed in, and what the server said. `onConfirmed` gets the record as it now
 * stands, to put back in the list.
 */
export function useConfirmPayment<T extends { orderId: string }>(
  confirm: (orderId: string, reference: string) => Promise<Confirmed<T>>,
  onConfirmed: (record: T) => void
) {
  const [target, setTarget] = useState<T | null>(null);
  const [reference, setReference] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const open = useCallback((record: T) => {
    setTarget(record);
    setReference('');
    setError(null);
    setReferenceError(null);
    setNotice(null);
  }, []);

  const cancel = useCallback(() => setTarget(null), []);

  const changeReference = useCallback((value: string) => {
    setReference(value);
    setReferenceError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!target) return;
    setIsBusy(true);
    setError(null);
    try {
      const result = await confirm(target.orderId, reference.trim());
      onConfirmed(result.data);
      setNotice(result.message);
      setTarget(null);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.fields?.reference) setReferenceError(err.fields.reference);
      else setError(err instanceof Error ? err.message : 'Could not confirm this payment.');
    } finally {
      setIsBusy(false);
    }
  }, [confirm, onConfirmed, reference, target]);

  return { target, reference, changeReference, isBusy, error, referenceError, notice, open, cancel, submit };
}

export default useConfirmPayment;
