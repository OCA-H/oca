'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { memberSignInHelper } from '../helper';
import { memberSignInService } from '../services';

/** Long enough to read the welcome, short enough not to feel like waiting. */
const HANDOFF_MS = 900;

/**
 * Where to go after signing in: ?redirect= when it stays on this site, else the member's profile.
 * Resolving it against this origin catches every form a browser would send elsewhere
 * ("//evil.com", "/\evil.com", "https://...").
 */
export function signInTarget(): string {
  if (typeof window === 'undefined') return ROUTES.PROFILE;
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (!redirect) return ROUTES.PROFILE;
  try {
    const url = new URL(redirect, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : ROUTES.PROFILE;
  } catch {
    return ROUTES.PROFILE;
  }
}

export function useMemberSignInHandler() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  /** Set once sign-in succeeds: the page shows the welcome hand-off until the next page opens. */
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const hasSignedIn = useRef(false);

  // Next.js keeps this page alive (hidden) after leaving it and restores it as it was, so coming
  // back after signing out would show the old welcome and the typed password. Once a sign-in has
  // gone through, reset everything as the page is hidden; it returns as a fresh form.
  useLayoutEffect(() => {
    return () => {
      if (!hasSignedIn.current) return;
      hasSignedIn.current = false;
      setWelcomeName(null);
      setIsLoading(false);
      setFeedback(null);
      setShowPassword(false);
      setPassword('');
      setUser('');
    };
  }, []);

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
    let response;
    try {
      response = await memberSignInService.login({ user, pass: password });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please verify your details.';
      setFeedback({ type: 'error', text: message });
      setIsLoading(false);
      return;
    }

    // One hand-off, straight to the target: the welcome fades in over the form while the next
    // page is fetched, then replace() moves there, so Back does not return to this form.
    hasSignedIn.current = true;
    const target = signInTarget();
    const fullName = response.data?.fullName || 'Columban';
    setWelcomeName(fullName.split(' ').find((part) => part && !part.endsWith('.')) || fullName);
    router.prefetch(target);
    window.dispatchEvent(new CustomEvent('oca_auth_change', { detail: { isAuthenticated: true } }));
    await new Promise((resolve) => setTimeout(resolve, HANDOFF_MS));
    router.replace(target);
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
    welcomeName,
    handleSubmit,
  };
}

export default useMemberSignInHandler;
