'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { memberSignInHelper } from '../helper';
import { memberSignInService } from '../services';

export function useMemberSignInHandler() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const fillDemoCredentials = (type: 'member' | 'columban' | 'admin' = 'member') => {
    if (type === 'member') {
      setUser('member@oldcolumban.net');
      setPassword('Columban@1994');
    } else if (type === 'columban') {
      setUser('columban');
      setPassword('Columban@2005');
    } else {
      setUser('admin');
      setPassword('OcaAdmin@2026');
    }
    setFeedback(null);
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
      const response = await memberSignInService.login({ user, pass: password });
      setFeedback({
        type: 'success',
        text: `Welcome back, ${response.data?.fullName || 'Columban'}! Redirecting to Member Portal...`,
      });

      // Check for redirect query parameter in URL, otherwise go to /sv/member-portal
      let targetUrl = '/sv/member-portal';
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get('redirect');
        if (redirectParam && redirectParam.startsWith('/')) {
          targetUrl = redirectParam;
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('oca_auth_change', { detail: { isAuthenticated: true } }));
      }

      setTimeout(() => {
        router.push(targetUrl);
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please verify your details.';
      setFeedback({ type: 'error', text: message });
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
    fillDemoCredentials,
  };
}

export default useMemberSignInHandler;
