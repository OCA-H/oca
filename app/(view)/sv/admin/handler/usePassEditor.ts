'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminService, type AdminEventPass, type EventPassChanges } from '../services';

/** Form values: numbers stay strings while typed, so a cleared box is not read as 0. */
export type PassForm = Record<keyof EventPassChanges, string>;

export const passToForm = (pass: AdminEventPass): PassForm => ({
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

/**
 * The edit form for one pass. Saving asks first: the form opens a confirm dialog listing the
 * changes, and only its confirm button writes to the database. `onSaved` gets the pass as saved.
 */
export function usePassEditor(pass: AdminEventPass, onSaved: (pass: AdminEventPass) => void) {
  const [form, setForm] = useState<PassForm>(() => passToForm(pass));
  const [shownVersion, setShownVersion] = useState(pass.updatedAt);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  if (pass.updatedAt !== shownVersion) {
    // The pass changed (saved here, or fetched again): the form starts again from it.
    setShownVersion(pass.updatedAt);
    setForm(passToForm(pass));
    setFieldErrors({});
  }
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const saved = passToForm(pass);
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

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
    setForm(saved);
    setFieldErrors({});
    setError(null);
  };

  /** The form's submit: asks before saving. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !isDirty) return;
    setError(null);
    setIsConfirming(true);
  };

  const cancelConfirm = () => {
    setIsConfirming(false);
    setError(null);
  };

  const confirmSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await adminService.updatePass(pass.id, {
        ...form,
        price: toNumber(form.price),
        totalQuantity: toNumber(form.totalQuantity),
        availableQuantity: toNumber(form.availableQuantity),
        displayOrder: toNumber(form.displayOrder),
      });
      setIsConfirming(false);
      setIsSaved(true);
      onSaved(result);
    } catch (err) {
      const fields = err instanceof ApiError ? err.fields : {};
      if (Object.keys(fields).length > 0) {
        // Problems with fields are shown beside them, so the dialog steps aside.
        setFieldErrors(fields);
        setIsConfirming(false);
      }
      setError(err instanceof Error ? err.message : 'Could not save this pass.');
    } finally {
      setIsSaving(false);
    }
  };

  return { form, saved, setField, fieldErrors, error, isSaving, isSaved, isDirty, reset, handleSubmit, isConfirming, cancelConfirm, confirmSave };
}

export default usePassEditor;
