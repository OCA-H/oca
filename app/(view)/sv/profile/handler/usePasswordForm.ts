'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { profileService } from '../services';

type PasswordField = 'current' | 'new' | 'confirm';

const EMPTY = { current: '', new: '', confirm: '' };

export function usePasswordForm() {
  const [values, setValues] = useState<Record<PasswordField, string>>(EMPTY);
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({ current: false, new: false, confirm: false });
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isMismatch = !!values.confirm && values.new !== values.confirm;

  const setValue = (name: PasswordField, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const toggleVisible = (name: PasswordField) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMismatch) return;
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await profileService.changePassword(values.current, values.new);
      setValues(EMPTY);
      setIsSaved(true);
      document.getElementById('mp-password-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not update your password.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSaving(false);
    }
  };

  return { values, setValue, visible, toggleVisible, isMismatch, fieldErrors, error, isSaving, isSaved, handleSubmit };
}

export default usePasswordForm;
