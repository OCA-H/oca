'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(view)/common/helper/useAuth';

export type AppRoute =
  | 'home'
  | 'vision-mission'
  | 'executive-committee'
  | 'membership'
  | 'donation'
  | 'annual-dinner'
  | 'sports'
  | 'annual-lunch'
  | 'member-signin'
  | 'partner-organization';

/** How long every home page carousel rests on a card before moving on. */
const CAROUSEL_INTERVAL_MS = 3500;

export function useHomeHandler() {
  const { isAuthenticated, user, isLoading: isAuthLoading, signOut } = useAuth();
  const [activeRoute, setActiveRoute] = useState<AppRoute>('home');

  // Smooth scroll support for hash anchors on initial load if present (e.g. /#events)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, []);

  // Carousel initializers
  useEffect(() => {
    /**
     * Loops a card carousel forever. Its cards are rendered twice (the copies marked data-clone),
     * so once it has scrolled through one full set it can jump back by that much unseen.
     */
    function setupCarousel(trackId: string, prevSelector: string, nextSelector: string, cardSelector: string) {
      const track = document.getElementById(trackId);
      const prevBtn = document.querySelector(prevSelector);
      const nextBtn = document.querySelector(nextSelector);
      if (!track || !prevBtn || !nextBtn) return () => {};

      let timer: ReturnType<typeof setInterval> | undefined;

      const firstCard = () => track.querySelector<HTMLElement>(`${cardSelector}:not([data-clone])`);
      const loopWidth = () => {
        const first = firstCard();
        const firstClone = track.querySelector<HTMLElement>(`${cardSelector}[data-clone]`);
        return first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0;
      };
      const step = () => (firstCard()?.offsetWidth ?? 300) + (parseFloat(getComputedStyle(track).columnGap) || 0);

      const next = () => {
        const loop = loopWidth();
        if (loop > 0 && track.scrollLeft >= loop - 1) track.scrollTo({ left: track.scrollLeft - loop, behavior: 'instant' });
        track.scrollBy({ left: step(), behavior: 'smooth' });
      };

      const prev = () => {
        const loop = loopWidth();
        if (loop > 0 && track.scrollLeft <= 1) track.scrollTo({ left: track.scrollLeft + loop, behavior: 'instant' });
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      };

      const stopAuto = () => clearInterval(timer);
      const startAuto = () => {
        stopAuto();
        // Holds still while one of its videos is playing, so it does not slide away mid-video.
        timer = setInterval(() => {
          if (!Array.from(track.querySelectorAll('video')).some((video) => !video.paused)) next();
        }, CAROUSEL_INTERVAL_MS);
      };

      nextBtn.addEventListener('click', next);
      prevBtn.addEventListener('click', prev);
      track.addEventListener('mouseenter', stopAuto);
      track.addEventListener('mouseleave', startAuto);
      startAuto();

      return () => {
        stopAuto();
        nextBtn.removeEventListener('click', next);
        prevBtn.removeEventListener('click', prev);
        track.removeEventListener('mouseenter', stopAuto);
        track.removeEventListener('mouseleave', startAuto);
      };
    }

    const cleanups = [
      setupCarousel('noticeCards', '.notice-nav.prev', '.notice-nav.next', '.notice-card'),
      setupCarousel('postCarousel', '.post-nav.prev', '.post-nav.next', '.post-card'),
    ];

    // Amount chips handler
    document.querySelectorAll('.amount-row').forEach((row: any) => {
      row.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const chip = target.closest('.amount-chip') as HTMLElement;
        if (!chip) return;
        row.querySelectorAll('.amount-chip').forEach((c: any) => c.classList.remove('active'));
        chip.classList.add('active');
        const field = document.getElementById(row.dataset.target || '') as HTMLInputElement;
        if (field && chip.dataset.value) {
          field.value = chip.dataset.value;
        }
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [activeRoute]);

  return {
    activeRoute,
    setActiveRoute,
    isAuthenticated,
    user,
    isAuthLoading,
    signOut,
  };
}

export type HomeHandler = ReturnType<typeof useHomeHandler>;
