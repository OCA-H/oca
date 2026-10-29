'use client';

import { useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { submitContactInquiry, type ContactFormPayload } from '../services';

const EMPTY: ContactFormPayload = { name: '', email: '', batch: '', phone: '', subject: '', message: '', website: '' };

/** The "Get in touch" form on the home page: its fields, sending, and what came back. */
export function useContactForm() {
  const [form, setForm] = useState<ContactFormPayload>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const setField = (name: keyof ContactFormPayload, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setFieldErrors({});
    try {
      const { message } = await submitContactInquiry(form);
      setSentMessage(message);
      setForm(EMPTY);
      requestAnimationFrame(() => document.getElementById('contact-ok')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not send your message. Please try again.');
      if (err instanceof ApiError) setFieldErrors(err.fields);
    } finally {
      setIsSending(false);
    }
  };

  const sendAnother = (e: React.MouseEvent) => {
    e.preventDefault();
    setSentMessage(null);
    requestAnimationFrame(() => document.getElementById('ct-name')?.focus());
  };

  return { form, setField, fieldErrors, error, sentMessage, isSending, handleSubmit, sendAnother };
}

export default useContactForm;
