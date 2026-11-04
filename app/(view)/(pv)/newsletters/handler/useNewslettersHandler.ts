'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { newslettersService, type EmailUpdateRequest } from '../services';

const EMPTY: EmailUpdateRequest = { name: '', email: '', batch: '', website: '' };

/** The "Have them sent to you" form: its fields, sending, and what came back. */
export function useNewslettersHandler() {
  const [form, setForm] = useState<EmailUpdateRequest>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const setField = (key: keyof EmailUpdateRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setError(null);
    setFieldErrors({});
    setSentMessage(null);
    try {
      const { message } = await newslettersService.requestEmailUpdate(form);
      setSentMessage(message);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your request. Please try again.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSending(false);
    }
  };

  return { form, setField, fieldErrors, error, sentMessage, isSending, handleSubmit };
}

export default useNewslettersHandler;
