'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from './routes';

export interface AuthUser {
  id: number;
  memberId: string;
  email: string;
  fullName: string;
  role: string;
  membershipType?: string;
  batchYear?: string | null;
}

/**
 * The last answer from /api/auth/me in this tab: undefined until the first one. Every page
 * renders its own Header, so without this each page would start as "signed out" and then
 * flip to the member's menu once the check came back.
 */
let lastKnownUser: AuthUser | null | undefined;

const AUTH_CHANGE_EVENT = 'oca_auth_change';

/**
 * Ends the session and forgets the member in this tab. Every sign-out button uses this and then
 * opens member sign-in. The member is forgotten before the request finishes, so the sign-in page
 * never mistakes a stale "signed in" for real and sends them back into the members area.
 */
export async function signOutMember(): Promise<void> {
  lastKnownUser = null;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { isAuthenticated: false } }));
  await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' }).catch(() => undefined);
}

/** Where every sign-out lands. */
export const SIGNED_OUT_ROUTE = ROUTES.MEMBER_SIGNIN;

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => lastKnownUser ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(lastKnownUser));
  const [isLoading, setIsLoading] = useState<boolean>(() => lastKnownUser === undefined);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && data?.data) {
        lastKnownUser = data.data as AuthUser;
        setUser(lastKnownUser);
        setIsAuthenticated(true);
      } else {
        lastKnownUser = null;
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      lastKnownUser = null;
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  }, [router]);

  useEffect(() => {
    checkAuth();

    // A sign-out is known for certain, so it applies at once; a sign-in is confirmed with the API.
    const handleAuthChange = (event: Event) => {
      if ((event as CustomEvent<{ isAuthenticated?: boolean }>).detail?.isAuthenticated === false) {
        lastKnownUser = null;
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      checkAuth();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    signOut,
  };
}

export default useAuth;
