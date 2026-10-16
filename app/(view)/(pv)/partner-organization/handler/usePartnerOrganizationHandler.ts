'use client';

import { useState } from 'react';
import { partnerOrganizationHelper } from '../helper';
import { partnerOrganizationService } from '../services';

export function usePartnerOrganizationHandler() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!partnerOrganizationHelper.validateUser(user)) {
      setFeedback({ type: 'error', text: 'Please enter your Email ID or Mobile number.' });
      return;
    }

    if (!partnerOrganizationHelper.validatePassword(password)) {
      setFeedback({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setIsLoading(true);
    try {
      await partnerOrganizationService.login({ user, pass: password });
      setFeedback({ type: 'success', text: 'Sign in successful! Redirecting...' });
    } catch {
      setFeedback({ type: 'error', text: 'Sign in failed. Please verify your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    isLoading,
    feedback,
    handleSubmit,
  };
}

export default usePartnerOrganizationHandler;
