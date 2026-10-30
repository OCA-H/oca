'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminService, type AdminFund } from '../services';
import { fundChanges, type FundForm } from './useFundEditor';

/** The add form: a head's details, how members give to it, and whether it takes contributions yet. */
export type NewFundForm = FundForm & { kind: 'amount' | 'unit'; status: 'active' | 'suspended' };

/** A blank head, placed after the others on the form, with the amount limits new heads start from. */
const blankFund = (sortOrder: number): NewFundForm => ({
  kind: 'amount',
  status: 'active',
  label: '',
  note: '',
  sortOrder: String(sortOrder),
  unitAmount: '',
  unitLabel: '',
  maxUnits: '10',
  minAmount: '100',
  maxAmount: '10000000',
});

/**
 * Adding a contribution head: the form opens from the panel, and like every change here it asks
 * first; only the confirm dialog's button writes to the database. `nextSortOrder` puts the new
 * head last on the contribution form unless the admin changes it.
 */
export function useNewFund(nextSortOrder: number, onCreated: (fund: AdminFund) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<NewFundForm>(() => blankFund(nextSortOrder));
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const open = () => {
    if (!isOpen) {
      setForm(blankFund(nextSortOrder));
      setFieldErrors({});
      setError(null);
      setIsOpen(true);
    }
    requestAnimationFrame(() => document.getElementById('ad-newfund-label')?.focus());
  };

  const close = () => {
    setIsOpen(false);
    setIsConfirming(false);
  };

  const setField = (key: keyof NewFundForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((errors) => {
      const rest = { ...errors };
      delete rest[key];
      return rest;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setError(null);
    setIsConfirming(true);
  };

  const cancel = () => {
    setIsConfirming(false);
    setError(null);
  };

  const confirm = async () => {
    setIsBusy(true);
    setError(null);
    try {
      const fund = await adminService.createFund({ ...fundChanges(form, form.status, form.kind === 'unit'), kind: form.kind });
      setIsConfirming(false);
      setIsOpen(false);
      onCreated(fund);
    } catch (err) {
      const fields = err instanceof ApiError ? err.fields : {};
      if (Object.keys(fields).length > 0) {
        // Problems with fields are shown beside them, so the dialog steps aside.
        setFieldErrors(fields);
        setIsConfirming(false);
      }
      setError(err instanceof Error ? err.message : 'Could not add this head.');
    } finally {
      setIsBusy(false);
    }
  };

  return { isOpen, open, close, form, setField, fieldErrors, error, isBusy, isConfirming, handleSubmit, cancel, confirm };
}

export type NewFundEditor = ReturnType<typeof useNewFund>;
export default useNewFund;
