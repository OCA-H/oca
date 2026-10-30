'use client';

import { useMemo, useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { joinPhone, splitPhone, type PhoneParts } from '@/app/(view)/common/helper/phone';
import { profileHelper } from '../helper';
import { profileService, type MemberProfile, type ProfileAddress, type ProfileUpdate } from '../services';

export function useAccountForm(profile: MemberProfile, onSaved: (profile: MemberProfile) => void) {
  const saved = useMemo(() => profileHelper.toForm(profile), [profile]);
  const [form, setForm] = useState<ProfileUpdate>(saved);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  // The picker's country code, kept apart so it holds while the number is empty.
  const [mobileCode, setMobileCode] = useState(() => splitPhone(saved.mobile).code);
  const phone: PhoneParts = { code: mobileCode, number: splitPhone(form.mobile).number };

  const isDirty = profileHelper.isDirty(form, saved);
  const isLocked = (field: 'email' | 'mobile') => profile.lockedFields.includes(field);

  /** Drops a field's error once the member starts fixing it. */
  const clearFieldError = (name: string) =>
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const setField = (name: keyof Omit<ProfileUpdate, 'address'>, value: string) => {
    if ((name === 'email' || name === 'mobile') && isLocked(name)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
    setIsSaved(false);
  };

  /** The mobile is matched at sign-in, so an Indian number is kept without +91, as it always has been. */
  const setPhone = (parts: PhoneParts) => {
    if (isLocked('mobile')) return;
    setMobileCode(parts.code);
    setField('mobile', joinPhone(parts, { bareIndia: true }));
  };

  const setAddress = (name: keyof ProfileAddress, value: string) => {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    clearFieldError(name);
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !isDirty) return;
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const updated = await profileService.updateProfile(form);
      onSaved(updated);
      setForm(profileHelper.toForm(updated));
      setMobileCode(splitPhone(updated.mobile).code);
      setIsSaved(true);
      requestAnimationFrame(() =>
        document.getElementById('mp-account-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not save your details.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDiscard = () => {
    setForm(saved);
    setMobileCode(splitPhone(saved.mobile).code);
    setFieldErrors({});
    setError(null);
    setIsDiscardOpen(false);
  };

  return {
    form,
    setField,
    phone,
    setPhone,
    setAddress,
    isLocked,
    isDirty,
    fieldErrors,
    error,
    isSaving,
    isSaved,
    handleSubmit,
    isDiscardOpen,
    openDiscard: () => (isDirty ? setIsDiscardOpen(true) : confirmDiscard()),
    closeDiscard: () => setIsDiscardOpen(false),
    confirmDiscard,
  };
}

export default useAccountForm;
