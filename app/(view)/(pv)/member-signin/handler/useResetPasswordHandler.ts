'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resetPasswordContent } from '../content';
import { memberSignInHelper } from '../helper';
import { memberSignInService } from '../services';

export type ResetPasswordStage = 'form' | 'invalid' | 'done';

/** Reads ?token= from the emailed link and sets the new password with it. */
export function useResetPasswordHandler() {
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<ResetPasswordStage>(
    memberSignInHelper.isResetToken(token) ? 'form' : 'invalid'
  );

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!memberSignInHelper.isStrongEnough(password)) {
      setError(resetPasswordContent.form.tooShort);
      return;
    }
    if (password !== confirm) {
      setError(resetPasswordContent.form.mismatch);
      return;
    }

    setIsLoading(true);
    try {
      await memberSignInService.resetPassword(token, password);
      setStage('done');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'We could not change your password. Please try again.';
      // A spent or expired link can't be retried; show the "request a new link" state instead.
      if (/invalid or has expired/i.test(message)) setStage('invalid');
      else setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stage,
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    toggleShowPassword,
    isLoading,
    error,
    handleSubmit,
  };
}

export default useResetPasswordHandler;
