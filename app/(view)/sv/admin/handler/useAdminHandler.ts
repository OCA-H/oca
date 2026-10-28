'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ApiError } from '@/app/(view)/common/services/api.service';
import { SIGNED_OUT_ROUTE, signOutMember } from '@/app/(view)/common/helper/useAuth';
import type { AdminPanel } from '../content';
import { adminHelper } from '../helper';
import { adminService, type AdminUser, type SectionSummary } from '../services';

export function useAdminHandler() {
  const router = useRouter();
  // The address is the source of truth for the open panel, so refresh, links and Back all agree.
  const panel = adminHelper.panelFromPath(usePathname());
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Signed in, but not an admin (or no longer one). */
  const [isDenied, setIsDenied] = useState(false);
  const scrollTo = useRef<AdminPanel | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([adminService.getMe(), adminService.listSections()])
      .then(([me, list]) => {
        if (!isMounted) return;
        setAdmin(me);
        setSections(list);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        if (err instanceof ApiError && err.status === 403) setIsDenied(true);
        else setError(err instanceof Error ? err.message : 'Could not load the admin panel.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /** On phones the menu is a sideways row of pills: keeps the open panel's pill in view. */
  const centerNavLink = useCallback((name: AdminPanel, behavior: ScrollBehavior) => {
    const link = document.querySelector<HTMLElement>(`.mp-link[data-panel="${name}"]`);
    const row = link?.parentElement;
    if (window.innerWidth <= 900 && link && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior });
    }
  }, []);

  /** Brings a panel's heading into view and focus once it is showing. */
  const revealPanel = useCallback(
    (name: AdminPanel) => {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-admin-panel="${name}"] h2`)?.focus({ preventScroll: true });
        const isNarrow = window.innerWidth <= 900;
        const anchor = document.querySelector(isNarrow ? '.mp-side' : '.mp-main');
        if (!anchor) return;
        const rect = anchor.getBoundingClientRect();
        const top = (isNarrow ? rect.bottom - 70 : rect.top - 100) + window.pageYOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        centerNavLink(name, 'smooth');
      });
    },
    [centerNavLink]
  );

  /** Moves to the panel's own address without a reload; unsaved edits in other panels are kept. */
  const showPanel = useCallback(
    (name: AdminPanel) => {
      if (name === panel) {
        revealPanel(name);
        return;
      }
      scrollTo.current = name;
      window.history.pushState(null, '', adminHelper.panelPath(name));
    },
    [panel, revealPanel]
  );

  useEffect(() => {
    if (scrollTo.current !== panel) return;
    scrollTo.current = null;
    revealPanel(panel);
  }, [panel, revealPanel]);

  // After a refresh or a shared link, the open panel's pill may start off-screen.
  const hasAdmin = admin !== null;
  const initialPanel = useRef(panel);
  useEffect(() => {
    if (hasAdmin) requestAnimationFrame(() => centerNavLink(initialPanel.current, 'instant'));
  }, [hasAdmin, centerNavLink]);

  /** Updates the dashboard's "Last saved" once a section is saved. */
  const markSaved = useCallback((summary: SectionSummary) => {
    setSections((list) => list.map((item) => (item.key === summary.key ? summary : item)));
  }, []);

  const [isSigningOut, setIsSigningOut] = useState(false);
  const hasSignedOut = useRef(false);
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    hasSignedOut.current = true;
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  };

  // Next.js keeps this page alive (hidden) after leaving it. After a sign-out, forget the admin
  // as the page is hidden, so the next person to sign in on this browser starts fresh.
  useLayoutEffect(() => {
    return () => {
      if (!hasSignedOut.current) return;
      hasSignedOut.current = false;
      setAdmin(null);
      setSections([]);
      setIsLoading(true);
      setIsSigningOut(false);
    };
  }, []);

  return {
    admin,
    sections,
    isLoading,
    error,
    isDenied,
    panel,
    showPanel,
    markSaved,
    handleSignOut,
    isSigningOut,
  };
}

export default useAdminHandler;
