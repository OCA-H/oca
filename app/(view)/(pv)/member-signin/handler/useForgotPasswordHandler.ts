'use client';

import { useState } from 'react';
import { memberSignInHelper } from '../helper';
import { memberSignInService } from '../services';

export function useForgotPasswordHandler() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!memberSignInHelper.validateUser(identifier)) {
      setError('Please enter your Member ID, Email ID, or Mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      await memberSignInService.requestPasswordReset(identifier.trim());
      setSentTo(identifier.trim());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not send the reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /** Back to the form, keeping what was typed, to try other details. */
  const tryAgain = () => {
    setSentTo(null);
    setError(null);
  };

  return { identifier, setIdentifier, isLoading, error, sentTo, handleSubmit, tryAgain };
}

export default useForgotPasswordHandler;
