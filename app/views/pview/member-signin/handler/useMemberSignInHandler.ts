'use client';

import { useState } from 'react';
import { memberSignInHelper } from '../helper';
import { memberSignInService } from '../services';

export function useMemberSignInHandler() {
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

    if (!memberSignInHelper.validateUser(user)) {
      setFeedback({ type: 'error', text: 'Please enter your User ID, Email ID, or Mobile number.' });
      return;
    }

    if (!memberSignInHelper.validatePassword(password)) {
      setFeedback({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setIsLoading(true);
    try {
      await memberSignInService.login({ user, pass: password });
      setFeedback({ type: 'success', text: 'Sign in successful! Redirecting...' });
    } catch {
      setFeedback({ type: 'error', text: 'Sign in failed. Please verify your details.' });
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

export default useMemberSignInHandler;
