'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
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
 * Who is signed in, shared by every component in this tab: undefined until /api/auth/me first
 * answers. One store rather than state per component, because Next.js keeps pages alive (hidden)
 * between visits: a restored page's Header reads the current answer instead of the one it had
 * when it was hidden, and a new page's Header does not start as "signed out" and then flip.
 */
let lastKnownUser: AuthUser | null | undefined;
const listeners = new Set<() => void>();

function setLastKnownUser(user: AuthUser | null) {
  lastKnownUser = user;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => lastKnownUser;
// The server never knows the visitor, so it renders the "still checking" state.
const getServerSnapshot = () => undefined;

const AUTH_CHANGE_EVENT = 'oca_auth_change';

/** Asks the API who is signed in and shares the answer. */
async function checkAuth(): Promise<void> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json().catch(() => null);
    setLastKnownUser(res.ok && data?.ok && data?.data ? (data.data as AuthUser) : null);
  } catch {
    setLastKnownUser(null);
  }
}

/**
 * Ends the session and forgets the member in this tab. Every sign-out button uses this and then
 * opens member sign-in. The member is forgotten before the request finishes, so the sign-in page
 * never mistakes a stale "signed in" for real and sends them back into the members area.
 */
export async function signOutMember(): Promise<void> {
  setLastKnownUser(null);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { isAuthenticated: false } }));
  await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' }).catch(() => undefined);
}

/** Where every sign-out lands. */
export const SIGNED_OUT_ROUTE = ROUTES.MEMBER_SIGNIN;

export function useAuth() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const signOut = useCallback(async () => {
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  }, [router]);

  useEffect(() => {
    // Also runs when a hidden page is shown again, so its Header re-checks the session then.
    checkAuth();

    // A sign-out is known for certain, so it applies at once; a sign-in is confirmed with the API.
    const handleAuthChange = (event: Event) => {
      if ((event as CustomEvent<{ isAuthenticated?: boolean }>).detail?.isAuthenticated === false) {
        setLastKnownUser(null);
        return;
      }
      checkAuth();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading: user === undefined,
    checkAuth,
    signOut,
  };
}

export default useAuth;
