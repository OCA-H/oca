'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { profileHelper } from '../helper';
import { profileService, type MemberProfile, type ProfileAddress, type ProfileUpdate } from '../services';

export function useAccountForm(profile: MemberProfile, onSaved: (profile: MemberProfile) => void) {
  const [form, setForm] = useState<ProfileUpdate>(() => profileHelper.toForm(profile));
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const setField = (name: keyof Omit<ProfileUpdate, 'address'>, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const setAddress = (name: keyof ProfileAddress, value: string) => {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const saved = await profileService.updateProfile(form);
      onSaved(saved);
      setForm(profileHelper.toForm(saved));
      setIsSaved(true);
      document.getElementById('mp-account-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not save your details.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDiscard = () => {
    setForm(profileHelper.toForm(profile));
    setFieldErrors({});
    setError(null);
    setIsDiscardOpen(false);
  };

  return {
    form,
    setField,
    setAddress,
    fieldErrors,
    error,
    isSaving,
    isSaved,
    handleSubmit,
    isDiscardOpen,
    openDiscard: () => setIsDiscardOpen(true),
    closeDiscard: () => setIsDiscardOpen(false),
    confirmDiscard,
  };
}

export default useAccountForm;
