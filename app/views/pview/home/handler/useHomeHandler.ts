'use client';

import { useEffect, useState } from 'react';
import { galleryAlbums, GalleryAlbum } from '../content/home.content';

export function useHomeHandler() {
  const [activeRoute, setActiveRoute] = useState<'home' | 'vision-mission' | 'executive-committee' | 'membership' | 'donation'>('home');
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Hash-based subpage routing and scroll handling
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'top' || hash === 'home') {
        setActiveRoute('home');
      } else {
        const bang = hash.indexOf('!');
        const pageKey = bang === -1 ? hash : hash.slice(0, bang);
        if (['vision-mission', 'executive-committee', 'membership', 'donation'].includes(pageKey)) {
          setActiveRoute(pageKey as any);
        } else {
          setActiveRoute('home');
          const target = document.getElementById(pageKey);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Carousel initializers
  useEffect(() => {
    function setupCarousel(trackId: string, prevSelector: string, nextSelector: string, cardSelector: string, gap: number, autoInterval: number) {
      const track = document.getElementById(trackId);
      const prevBtn = document.querySelector(prevSelector);
      const nextBtn = document.querySelector(nextSelector);
      if (!track || !prevBtn || !nextBtn) return;

      const step = 320;
      let timer: any = null;

      const next = () => {
        track.scrollBy({ left: step, behavior: 'smooth' });
      };

      const prev = () => {
        track.scrollBy({ left: -step, behavior: 'smooth' });
      };

      nextBtn.addEventListener('click', next);
      prevBtn.addEventListener('click', prev);

      const startAuto = () => {
        timer = setInterval(() => {
          if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            next();
          }
        }, autoInterval);
      };

      startAuto();

      track.addEventListener('mouseenter', () => clearInterval(timer));
      track.addEventListener('mouseleave', startAuto);
    }

    setupCarousel('noticeCarousel', '.notice-nav.prev', '.notice-nav.next', '.notice-card', 22, 4500);
    setupCarousel('postCarousel', '.post-nav.prev', '.post-nav.next', '.post-card', 22, 3500);

    // Mute button handler
    const mutedIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';
    const unmutedIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';

    document.querySelectorAll('.mute-btn').forEach((btn: any) => {
      btn.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        const muted = btn.dataset.muted === 'true';
        btn.dataset.muted = muted ? 'false' : 'true';
        btn.innerHTML = muted ? unmutedIcon : mutedIcon;
        btn.setAttribute('aria-label', muted ? 'Mute' : 'Unmute');
      });
    });

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
  }, [activeRoute]);

  // Gallery timed auto-sweep
  useEffect(() => {
    if (isHovered) return;
    const album = galleryAlbums[selectedAlbumIdx];
    if (!album) return;

    const timer = setInterval(() => {
      setSelectedPhotoIdx((prev) => {
        if (prev + 1 >= album.photos.length) {
          setSelectedAlbumIdx((prevAlbum) => (prevAlbum + 1) % galleryAlbums.length);
          return 0;
        }
        return prev + 1;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [selectedAlbumIdx, isHovered]);

  const currentAlbum = galleryAlbums[selectedAlbumIdx];
  const currentPhoto = currentAlbum?.photos[selectedPhotoIdx] || currentAlbum?.photos[0];

  return {
    activeRoute,
    setActiveRoute,
    selectedAlbumIdx,
    setSelectedAlbumIdx,
    selectedPhotoIdx,
    setSelectedPhotoIdx,
    currentAlbum,
    currentPhoto,
    setIsHovered,
  };
}

export type HomeHandler = ReturnType<typeof useHomeHandler>;
