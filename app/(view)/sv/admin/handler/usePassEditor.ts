'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminService, type AdminEventPass, type EventPassChanges } from '../services';

/** Form values: numbers stay strings while typed, so a cleared box is not read as 0. */
export type PassForm = Record<keyof EventPassChanges, string>;

const toForm = (pass: AdminEventPass): PassForm => ({
  label: pass.label,
  description: pass.description ?? '',
  batchEligibility: pass.batchEligibility ?? '',
  price: String(pass.price),
  totalQuantity: pass.totalQuantity === null ? '' : String(pass.totalQuantity),
  availableQuantity: pass.availableQuantity === null ? '' : String(pass.availableQuantity),
  status: pass.status,
  statusNote: pass.statusNote ?? '',
  displayOrder: String(pass.displayOrder),
});

// An empty number box goes as NaN, which the API rejects beside that field.
const toNumber = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

/** The edit form for one pass. `onSaved` gets the pass as saved, with its sales. */
export function usePassEditor(pass: AdminEventPass, onSaved: (pass: AdminEventPass) => void) {
  const [form, setForm] = useState<PassForm>(() => toForm(pass));
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shownVersion, setShownVersion] = useState(pass.updatedAt);
  if (pass.updatedAt !== shownVersion) {
    // The pass changed (saved here, or fetched again): the form starts again from it.
    setShownVersion(pass.updatedAt);
    setForm(toForm(pass));
    setFieldErrors({});
  }

  const isDirty = JSON.stringify(form) !== JSON.stringify(toForm(pass));

  const setField = (key: keyof PassForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((errors) => {
      const rest = { ...errors };
      delete rest[key];
      return rest;
    });
    setIsSaved(false);
  };

  const reset = () => {
    setForm(toForm(pass));
    setFieldErrors({});
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !isDirty) return;
    setIsSaving(true);
    setError(null);
    setIsSaved(false);
    try {
      const saved = await adminService.updatePass(pass.id, {
        ...form,
        price: toNumber(form.price),
        totalQuantity: toNumber(form.totalQuantity),
        availableQuantity: toNumber(form.availableQuantity),
        displayOrder: toNumber(form.displayOrder),
      });
      setIsSaved(true);
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fields);
      setError(err instanceof Error ? err.message : 'Could not save this pass.');
    } finally {
      setIsSaving(false);
    }
  };

  return { form, setField, fieldErrors, error, isSaving, isSaved, isDirty, reset, handleSubmit };
}

export default usePassEditor;
