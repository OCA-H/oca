'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminService, type AdminFund, type FundChanges } from '../services';

/** Form values: numbers stay strings while typed, so a cleared box is not read as 0. */
export type FundForm = {
  label: string;
  note: string;
  sortOrder: string;
  unitAmount: string;
  unitLabel: string;
  maxUnits: string;
  minAmount: string;
  maxAmount: string;
};

export const fundToForm = (fund: AdminFund): FundForm => ({
  label: fund.label,
  note: fund.note ?? '',
  sortOrder: String(fund.sortOrder),
  unitAmount: fund.unitAmount === null ? '' : String(fund.unitAmount),
  unitLabel: fund.unitLabel ?? '',
  maxUnits: fund.maxUnits === null ? '' : String(fund.maxUnits),
  minAmount: String(fund.minAmount),
  maxAmount: String(fund.maxAmount),
});

// An empty number box goes as NaN, which the API rejects beside that field.
export const toNumber = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

/** The form as the API takes it: only the unit fields, or only the amount fields, count. */
export const fundChanges = (values: FundForm, status: string, perUnit: boolean): FundChanges => ({
  label: values.label,
  note: values.note,
  status,
  sortOrder: toNumber(values.sortOrder),
  unitAmount: perUnit ? toNumber(values.unitAmount) : null,
  unitLabel: perUnit ? values.unitLabel : null,
  maxUnits: perUnit ? toNumber(values.maxUnits) : null,
  minAmount: perUnit ? null : toNumber(values.minAmount),
  maxAmount: perUnit ? null : toNumber(values.maxAmount),
});

/** What the confirm dialog is asking about. */
export type FundAction = { kind: 'save' } | { kind: 'status'; active: boolean } | { kind: 'delete' };

/**
 * One contribution head: its edit form, the active switch and delete. Every one of them asks
 * first: it opens a confirm dialog, and only the dialog's confirm button writes to the database.
 */
export function useFundEditor(fund: AdminFund, onSaved: (fund: AdminFund) => void, onDeleted: (id: number) => void) {
  const [form, setForm] = useState<FundForm>(() => fundToForm(fund));
  const [shownVersion, setShownVersion] = useState(fund.updatedAt);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  if (fund.updatedAt !== shownVersion) {
    // The head changed (saved here, or fetched again): the form starts again from it.
    setShownVersion(fund.updatedAt);
    setForm(fundToForm(fund));
    setFieldErrors({});
  }
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<FundAction | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const saved = fundToForm(fund);
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);
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
    setForm(saved);
    setFieldErrors({});
    setError(null);
  };

  const ask = (next: FundAction) => {
    setError(null);
    setIsSaved(false);
    setAction(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBusy && isDirty) ask({ kind: 'save' });
  };

  const cancel = () => {
    setAction(null);
    setError(null);
  };

  const changesFrom = (values: FundForm, status: string): FundChanges => fundChanges(values, status, perUnit);

  const confirm = async () => {
    if (!action) return;
    setIsBusy(true);
    setError(null);
    try {
      if (action.kind === 'delete') {
        await adminService.deleteFund(fund.id);
        setAction(null);
        onDeleted(fund.id);
        return;
      }
      // The switch saves only the status, from the head as saved: unsaved edits stay in the form.
      const result =
        action.kind === 'save'
          ? await adminService.updateFund(fund.id, changesFrom(form, fund.status))
          : await adminService.updateFund(fund.id, changesFrom(saved, action.active ? 'active' : 'suspended'));
      setAction(null);
      if (action.kind === 'save') setIsSaved(true);
      onSaved(result);
    } catch (err) {
      const fields = err instanceof ApiError ? err.fields : {};
      if (Object.keys(fields).length > 0) {
        // Problems with fields are shown beside them, so the dialog steps aside.
        setFieldErrors(fields);
        setAction(null);
      }
      setError(err instanceof Error ? err.message : 'Could not save this head.');
    } finally {
      setIsBusy(false);
    }
  };

  return {
    form,
    saved,
    setField,
    fieldErrors,
    error,
    isBusy,
    isSaved,
    isDirty,
    perUnit,
    reset,
    handleSubmit,
    action,
    askStatus: (active: boolean) => ask({ kind: 'status', active }),
    askDelete: () => ask({ kind: 'delete' }),
    cancel,
    confirm,
  };
}

export default useFundEditor;
