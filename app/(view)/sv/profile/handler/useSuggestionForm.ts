'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { profileService } from '../services';

export function useSuggestionForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setFieldErrors({});
    try {
      await profileService.sendSuggestion(subject, message);
      setIsSent(true);
      document.getElementById('mp-suggest-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not send your suggestion.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSending(false);
    }
  };

  const clear = () => {
    setSubject('');
    setMessage('');
    setFieldErrors({});
    setError(null);
  };

  const sendAnother = (e: React.MouseEvent) => {
    e.preventDefault();
    clear();
    setIsSent(false);
    requestAnimationFrame(() => document.getElementById('mps-subject')?.focus());
  };

  return { subject, setSubject, message, setMessage, fieldErrors, error, isSending, isSent, handleSubmit, clear, sendAnother };
}

export default useSuggestionForm;
