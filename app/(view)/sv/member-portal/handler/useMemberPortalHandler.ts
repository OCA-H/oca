'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SIGNED_OUT_ROUTE, signOutMember } from '@/app/(view)/common/helper/useAuth';
import { memberPortalService, type MemberProfile } from '../services';

export function useMemberPortalHandler() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const data = await memberPortalService.getProfile();
        if (isMounted) {
          setProfile(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not retrieve member profile.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  };

  return {
    profile,
    isLoading,
    error,
    isSigningOut,
    handleSignOut,
  };
}

export default useMemberPortalHandler;
