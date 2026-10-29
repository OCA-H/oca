'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

const ZOOM_ICON_SVG = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LB_SELECTORS = [
  '.page-hero-media .photo-tile',
  '.split-media .photo-tile',
  '.sports-poster .poster-frame',
  '.poster-wrap',
  '.spotlight-poster',
  '#events .event-card:not(.event-featured) .event-media',
  '#page-news-makers .nm-photo',
  '#page-remembrance .mem-photo',
  '#page-annual-dinner .dn-poster',
  '.dn-poster',
  '.photo-tile',
  '.media-stage .photo-tile',
  '.cause-card .photo-tile',
  '.hangout-card .photo-tile',
  '.comm-card .photo-tile',
  '.offer-card .photo-tile',
].join(',');

export const Lightbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [hasNav, setHasNav] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  // The gallery stage the image came from, whose own arrows drive prev/next here.
  const navStageRef = useRef<HTMLElement | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const closeLightbox = useCallback(() => {
    if (!isOpenRef.current) return;
    setIsOpen(false);
    document.body.classList.remove('lb-open');
    if (lastFocusRef.current && typeof lastFocusRef.current.focus === 'function') {
      lastFocusRef.current.focus({ preventScroll: true });
    }
    lastFocusRef.current = null;
    navStageRef.current = null;
  }, []);

  const showImage = useCallback((img: HTMLImageElement, triggerEl: HTMLElement) => {
    const finalSrc = img.currentSrc || img.src;
    const finalAlt = img.alt || '';
    
    // Find caption from nearby elements if alt is empty
    let capText = finalAlt;
    if (!capText) {
      const splitCap = triggerEl.closest('.split-media')?.querySelector('.split-caption');
      const tileCap = triggerEl.querySelector('.tile-caption .t');
      capText = splitCap?.textContent || tileCap?.textContent || '';
    }

    setSrc(finalSrc);
    setAlt(finalAlt);
    setCaption(capText);
  }, []);

  const openLightbox = useCallback((img: HTMLImageElement, triggerEl: HTMLElement) => {
    lastFocusRef.current = document.activeElement as HTMLElement;
    const stage = triggerEl.closest<HTMLElement>('.media-stage');
    navStageRef.current = stage?.querySelector('.stage-arrow') ? stage : null;
    setHasNav(!!navStageRef.current);
    showImage(img, triggerEl);
    setIsOpen(true);
    document.body.classList.add('lb-open');
  }, [showImage]);

  /** Steps the gallery stage, then shows whatever photo it lands on. */
  const stepImage = useCallback((dir: 'prev' | 'next') => {
    const stage = navStageRef.current;
    const arrow = stage?.querySelector<HTMLButtonElement>(`.stage-arrow.${dir}`);
    if (!stage || !arrow) return;
    arrow.click();
    // Let React re-render the stage before reading its new image.
    requestAnimationFrame(() => {
      const tile = stage.querySelector<HTMLElement>('.photo-tile');
      const img = tile?.querySelector<HTMLImageElement>('.tile-img');
      if (tile && img) showImage(img, tile);
    });
  }, [showImage]);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // Decorate matching elements with lb-trigger and zoom-badge
  useEffect(() => {
    const decorateElements = () => {
      const elements = document.querySelectorAll(LB_SELECTORS);
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const img = htmlEl.tagName === 'IMG' ? (htmlEl as HTMLImageElement) : htmlEl.querySelector<HTMLImageElement>('img');
        if (!img || !img.getAttribute('src')) return; // gradient-only tiles: nothing to enlarge

        if (!htmlEl.classList.contains('lb-trigger')) {
          htmlEl.classList.add('lb-trigger');
        }

        if (window.getComputedStyle(htmlEl).position === 'static') {
          htmlEl.style.position = 'relative';
        }

        if (htmlEl.tagName !== 'BUTTON' && !htmlEl.hasAttribute('role')) {
          htmlEl.setAttribute('role', 'button');
          htmlEl.setAttribute('tabindex', '0');
        }

        if (!htmlEl.hasAttribute('aria-label')) {
          htmlEl.setAttribute('aria-label', `View larger: ${img.alt || 'image'}`);
        }

        if (!htmlEl.querySelector('.zoom-badge')) {
          const badge = document.createElement('span');
          badge.className = 'zoom-badge';
          badge.setAttribute('aria-hidden', 'true');
          badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          htmlEl.appendChild(badge);
        }
      });
    };

    decorateElements();

    const observer = new MutationObserver(() => {
      decorateElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Global click & keyboard handlers
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // The viewer's own arrows, and the stage arrows stepImage clicks for them, mustn't close it.
      // React listens on document here too, so their stopPropagation can't keep the click from us.
      if ((e.target as Element).closest('.stage-arrow, .lightbox-nav')) return;

      if (isOpenRef.current) {
        closeLightbox();
        return;
      }

      const target = (e.target as HTMLElement).closest('.lb-trigger') as HTMLElement | null;
      if (target) {
        const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.querySelector<HTMLImageElement>('img');
        if (img && (img.src || img.getAttribute('src'))) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(img, target);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }

      if (isOpenRef.current && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        stepImage(e.key === 'ArrowLeft' ? 'prev' : 'next');
        return;
      }

      if ((e.key === 'Enter' || e.key === ' ') && !isOpenRef.current) {
        const active = document.activeElement as HTMLElement | null;
        const target = active?.closest('.lb-trigger') as HTMLElement | null;
        if (target && target.tagName !== 'BUTTON') {
          const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.querySelector<HTMLImageElement>('img');
          if (img && (img.src || img.getAttribute('src'))) {
            e.preventDefault();
            openLightbox(img, target);
          }
        }
      }

      if (e.key === 'Tab' && isOpenRef.current && closeBtnRef.current) {
        e.preventDefault();
        closeBtnRef.current.focus();
      }
    };

    const handleHashChange = () => {
      closeLightbox();
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
      document.body.classList.remove('lb-open');
    };
  }, [closeLightbox, openLightbox, stepImage]);

  return (
    <div
      className={`lightbox ${isOpen ? 'open' : ''}`}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      aria-hidden={!isOpen}
      onClick={closeLightbox}
    >
      <button
        ref={closeBtnRef}
        className="lightbox-close"
        id="lightboxClose"
        type="button"
        aria-label="Close image"
        onClick={(e) => {
          e.stopPropagation();
          closeLightbox();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5 5l14 14M19 5L5 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {hasNav && (
        <>
          <button
            className="lightbox-nav prev"
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              stepImage('prev');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="lightbox-nav next"
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              stepImage('next');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
      <figure className="lightbox-fig" onClick={closeLightbox}>
        {src ? <img id="lightboxImg" src={src} alt={alt} /> : null}
        {caption ? <figcaption id="lightboxCap">{caption}</figcaption> : null}
      </figure>
    </div>
  );
};

export default Lightbox;
