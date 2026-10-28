'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SIGNED_OUT_ROUTE, signOutMember } from '@/app/(view)/common/helper/useAuth';
import { profileContent, type ProfilePanel } from '../content';
import { profileHelper } from '../helper';
import { profileService, type MemberProfile } from '../services';

const { photo } = profileContent;

export function useProfileHandler() {
  const router = useRouter();
  // The address is the source of truth for the open panel, so refresh, links and Back all agree.
  const panel = profileHelper.panelFromPath(usePathname());
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollTo = useRef<ProfilePanel | null>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoMsg, setPhotoMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const [sentWishes, setSentWishes] = useState<string[]>([]);
  const photoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data);
        setPhotoSrc(data.avatarUrl);
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Could not load your profile.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
      clearTimeout(photoTimer.current);
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

  const sayPhoto = (text: string, bad = false) => {
    clearTimeout(photoTimer.current);
    setPhotoMsg({ text, bad });
    if (!bad) photoTimer.current = setTimeout(() => setPhotoMsg(null), 4000);
  };

  /** Checks the chosen image and previews it in the oval. */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!photo.types.test(file.type)) {
      sayPhoto(photo.badType, true);
    } else if (file.size > photo.maxBytes) {
      sayPhoto(photo.tooBig, true);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoSrc(reader.result as string);
        sayPhoto(photo.updated);
      };
      reader.onerror = () => sayPhoto(photo.unreadable, true);
      reader.readAsDataURL(file);
    }
    input.value = '';
  };

  const sendWish = (name: string) => setSentWishes((prev) => (prev.includes(name) ? prev : [...prev, name]));

  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await signOutMember();
    router.replace(SIGNED_OUT_ROUTE);
  };

  return {
    profile,
    setProfile,
    isLoading,
    error,
    panel,
    showPanel,
    photoSrc,
    photoMsg,
    handlePhotoChange,
    sentWishes,
    sendWish,
    handleSignOut,
    isSigningOut,
  };
}

export default useProfileHandler;
