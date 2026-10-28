'use client';

import { useLayoutEffect, useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { profileService } from '../services';

type PasswordField = 'current' | 'new' | 'confirm';

const EMPTY = { current: '', new: '', confirm: '' };
const HIDDEN = { current: false, new: false, confirm: false };

export function usePasswordForm() {
  const [values, setValues] = useState<Record<PasswordField, string>>(EMPTY);
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>(HIDDEN);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isMismatch = !!values.confirm && values.new !== values.confirm;
  const isComplete = Boolean(values.current && values.new && values.confirm);

  // Next.js keeps this page alive (hidden) between visits; passwords should never wait there.
  useLayoutEffect(() => {
    return () => {
      setValues(EMPTY);
      setVisible(HIDDEN);
      setFieldErrors({});
      setError(null);
      setIsSaved(false);
    };
  }, []);

  const setValue = (name: PasswordField, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Drop this field's error once the member starts fixing it.
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setIsSaved(false);
  };

  const toggleVisible = (name: PasswordField) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMismatch || isSaving) return;
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await profileService.changePassword(values.current, values.new);
      setValues(EMPTY);
      setVisible(HIDDEN);
      setIsSaved(true);
      requestAnimationFrame(() =>
        document.getElementById('mp-password-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not update your password.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSaving(false);
    }
  };

  return { values, setValue, visible, toggleVisible, isMismatch, isComplete, fieldErrors, error, isSaving, isSaved, handleSubmit };
}

export default usePasswordForm;
