'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { HomeGalleryAlbum } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { eventPhotographsHelper, type ViewerPhoto } from '../helper';

export const ALL_ALBUMS = 'all';

/**
 * The albums' filter, and the photo viewer: it steps through the photos of the albums shown (all of
 * them, or the one chosen), wrapping round at either end. Escape closes it; the arrow keys step.
 */
export function useEventPhotographsHandler(albums: HomeGalleryAlbum[]) {
  const [filter, setFilter] = useState<string>(ALL_ALBUMS);
  const [current, setCurrent] = useState<number | null>(null);

  const ids = useMemo(() => albums.map((album, i) => eventPhotographsHelper.albumId(album, i)), [albums]);
  const isShown = useCallback((index: number) => filter === ALL_ALBUMS || ids[index] === filter, [filter, ids]);

  /** The photos the viewer steps through: those of the albums shown, in order. */
  const photos = useMemo<ViewerPhoto[]>(
    () => albums.flatMap((album, i) => (isShown(i) ? album.photos.map((photo) => ({ ...photo, album: album.name })) : [])),
    [albums, isShown]
  );

  /** Where a photo of an album sits among the photos the viewer steps through. */
  const indexOf = (albumIndex: number, photoIndex: number) =>
    albums.slice(0, albumIndex).reduce((sum, album, i) => sum + (isShown(i) ? album.photos.length : 0), 0) + photoIndex;

  const open = (albumIndex: number, photoIndex: number) => setCurrent(indexOf(albumIndex, photoIndex));
  const close = useCallback(() => setCurrent(null), []);
  const step = useCallback(
    (by: number) => setCurrent((i) => (i === null || photos.length === 0 ? i : (i + by + photos.length) % photos.length)),
    [photos.length]
  );

  const chooseFilter = (id: string) => {
    setFilter(id);
    setCurrent(null);
  };

  const isOpen = current !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, step]);

  return {
    ids,
    filter,
    chooseFilter,
    isShown,
    viewer: isOpen ? { photo: photos[current], index: current, total: photos.length } : null,
    open,
    close,
    step,
  };
}

export default useEventPhotographsHandler;
