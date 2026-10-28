'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminService, type AdminFund, type FundChanges } from '../services';

/** Form values: numbers stay strings while typed, so a cleared box is not read as 0. */
export type FundForm = { label: string; note: string; sortOrder: string; unitAmount: string; maxUnits: string };

const toForm = (fund: AdminFund): FundForm => ({
  label: fund.label,
  note: fund.note ?? '',
  sortOrder: String(fund.sortOrder),
  unitAmount: fund.unitAmount === null ? '' : String(fund.unitAmount),
  maxUnits: fund.maxUnits === null ? '' : String(fund.maxUnits),
});

// An empty number box goes as NaN, which the API rejects beside that field.
const toNumber = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

/**
 * One contribution head: its edit form, the active switch (saved straight away) and delete.
 * `onSaved` gets the head as saved; `onDeleted` is called once it is gone.
 */
export function useFundEditor(fund: AdminFund, onSaved: (fund: AdminFund) => void, onDeleted: (id: number) => void) {
  const [form, setForm] = useState<FundForm>(() => toForm(fund));
  const [shownVersion, setShownVersion] = useState(fund.updatedAt);
  if (fund.updatedAt !== shownVersion) {
    // The head changed (saved here, or fetched again): the form starts again from it.
    setShownVersion(fund.updatedAt);
    setForm(toForm(fund));
  }
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'save' | 'switch' | 'delete' | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isDirty = JSON.stringify(form) !== JSON.stringify(toForm(fund));
  const perUnit = fund.unitAmount !== null;

  const setField = (key: keyof FundForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((errors) => {
      const rest = { ...errors };
      delete rest[key];
      return rest;
    });
    setIsSaved(false);
  };

  const reset = () => {
    setForm(toForm(fund));
    setFieldErrors({});
    setError(null);
  };

  const save = async (values: FundForm, status: string, kind: 'save' | 'switch') => {
    setBusy(kind);
    setError(null);
    setIsSaved(false);
    const changes: FundChanges = {
      label: values.label,
      note: values.note,
      status,
      sortOrder: toNumber(values.sortOrder),
      unitAmount: perUnit ? toNumber(values.unitAmount) : null,
      maxUnits: perUnit ? toNumber(values.maxUnits) : null,
    };
    try {
      const saved = await adminService.updateFund(fund.id, changes);
      setFieldErrors({});
      if (kind === 'save') setIsSaved(true);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fields);
      setError(err instanceof Error ? err.message : 'Could not save this head.');
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !isDirty) return;
    save(form, fund.status, 'save');
  };

  /** The switch saves just the status, from the head as saved (unsaved edits stay in the form). */
  const setActive = (on: boolean) => save(toForm(fund), on ? 'active' : 'suspended', 'switch');

  const confirmDelete = async () => {
    setBusy('delete');
    setError(null);
    try {
      await adminService.deleteFund(fund.id);
      onDeleted(fund.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this head.');
      setIsConfirmingDelete(false);
      setBusy(null);
    }
  };

  return {
    form,
    setField,
    fieldErrors,
    error,
    busy,
    isSaved,
    isDirty,
    perUnit,
    reset,
    handleSubmit,
    setActive,
    isConfirmingDelete,
    askDelete: () => setIsConfirmingDelete(true),
    cancelDelete: () => setIsConfirmingDelete(false),
    confirmDelete,
  };
}

export default useFundEditor;
