'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { profileContent, type ProfilePanel } from '../content';
import { profileService, type MemberProfile } from '../services';

const { photo } = profileContent;

export function useProfileHandler() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<ProfilePanel>('dashboard');
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

  /** Swaps the panel in place, then brings its heading into view and focus. */
  const showPanel = useCallback((name: ProfilePanel) => {
    setPanel(name);
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(`#mp-${name} h2`);
      heading?.focus({ preventScroll: true });

      const isNarrow = window.innerWidth <= 900;
      const anchor = document.querySelector(isNarrow ? '.mp-side' : '.mp-main');
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const top = (isNarrow ? rect.bottom - 70 : rect.top - 100) + window.pageYOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

      const link = document.querySelector<HTMLElement>(`.mp-link[data-panel="${name}"]`);
      const row = link?.parentElement;
      if (isNarrow && link && row && row.scrollWidth > row.clientWidth) {
        row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
      }
    });
  }, []);

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

  const handleSignOut = async () => {
    await profileService.signOut();
    window.dispatchEvent(new CustomEvent('oca_auth_change', { detail: { isAuthenticated: false } }));
    router.push(ROUTES.HOME);
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
  };
}

export default useProfileHandler;
