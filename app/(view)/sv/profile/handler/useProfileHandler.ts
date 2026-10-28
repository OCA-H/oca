'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SIGNED_OUT_ROUTE, signOutMember } from '@/app/(view)/common/helper/useAuth';
import type { ProfilePanel } from '../content';
import { profileHelper } from '../helper';
import { profileService, type MemberProfile } from '../services';

export function useProfileHandler() {
  const router = useRouter();
  // The address is the source of truth for the open panel, so refresh, links and Back all agree.
  const panel = profileHelper.panelFromPath(usePathname());
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollTo = useRef<ProfilePanel | null>(null);

  useEffect(() => {
    let isMounted = true;
    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Could not load your profile.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /** On phones the menu is a sideways row of pills: keeps the open panel's pill in view. */
  const centerNavLink = useCallback((name: ProfilePanel, behavior: ScrollBehavior) => {
    const link = document.querySelector<HTMLElement>(`.mp-link[data-panel="${name}"]`);
    const row = link?.parentElement;
    if (window.innerWidth <= 900 && link && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior });
    }
  }, []);

  /** Brings a panel's heading into view and focus once it is showing. */
  const revealPanel = useCallback((name: ProfilePanel) => {
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(`#mp-${name} h2`);
      heading?.focus({ preventScroll: true });

      const isNarrow = window.innerWidth <= 900;
      const anchor = document.querySelector(isNarrow ? '.mp-side' : '.mp-main');
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const top = (isNarrow ? rect.bottom - 70 : rect.top - 100) + window.pageYOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      centerNavLink(name, 'smooth');
    });
  }, [centerNavLink]);

  /**
   * Moves to the panel's own address without a reload or refetch: pushState keeps this page
   * mounted and usePathname picks up the change. The reveal waits for that render.
   */
  const showPanel = useCallback(
    (name: ProfilePanel) => {
      if (name === panel) {
        revealPanel(name);
        return;
      }
      scrollTo.current = name;
      window.history.pushState(null, '', profileHelper.panelPath(name));
    },
    [panel, revealPanel]
  );

  // After a refresh or a shared link, the open panel's pill may start off-screen.
  const hasProfile = profile !== null;
  const initialPanel = useRef(panel);
  useEffect(() => {
    if (hasProfile) requestAnimationFrame(() => centerNavLink(initialPanel.current, 'instant'));
  }, [hasProfile, centerNavLink]);

  useEffect(() => {
    if (scrollTo.current !== panel) return;
    scrollTo.current = null;
    revealPanel(panel);
  }, [panel, revealPanel]);

  const [isSigningOut, setIsSigningOut] = useState(false);
  /** Changes on every sign-out, so data loaded for the previous member (the card) is dropped too. */
  const [sessionKey, setSessionKey] = useState(0);
  const hasSignedOut = useRef(false);
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    hasSignedOut.current = true;
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  };

  // Next.js keeps this page alive (hidden) after leaving it and restores it as it was. After a
  // sign-out, forget the member as the page is hidden: if someone signs in again on this browser,
  // the members area comes back as a fresh skeleton and loads their details, never the last ones.
  useLayoutEffect(() => {
    return () => {
      if (!hasSignedOut.current) return;
      hasSignedOut.current = false;
      setProfile(null);
      setIsLoading(true);
      setError(null);
      setIsSigningOut(false);
      setSessionKey((key) => key + 1);
    };
  }, []);

  return {
    profile,
    setProfile,
    isLoading,
    error,
    panel,
    showPanel,
    handleSignOut,
    isSigningOut,
    sessionKey,
  };
}

export default useProfileHandler;
