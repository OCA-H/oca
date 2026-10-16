'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: number;
  memberId: string;
  email: string;
  fullName: string;
  role: string;
  membershipType?: string;
  batchYear?: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && data?.data) {
        setUser(data.data as AuthUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on signout
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('oca_auth_change', { detail: { isAuthenticated: false } }));
      }
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('oca_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('oca_auth_change', handleAuthChange);
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
