'use client';

import { useState, useEffect } from 'react';
import type { HomeGalleryAlbum, HomeGalleryPhoto } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

const NO_PHOTO: HomeGalleryPhoto = { image: '', caption: '' };

/** `albums` is what admins set in the admin panel; each has at least one photo. */
export function useGalleryHandler(albums: HomeGalleryAlbum[]) {
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const albumIdx = selectedAlbumIdx < albums.length ? selectedAlbumIdx : 0;
  const currentAlbum: HomeGalleryAlbum | undefined = albums[albumIdx];
  const photos = currentAlbum?.photos ?? [];
  const currentPhoto: HomeGalleryPhoto = photos[selectedPhotoIdx] || photos[0] || NO_PHOTO;

  useEffect(() => {
    if (isHovered) return;
    const album = albums[albumIdx];
    if (!album || album.photos.length === 0) return;

    const timer = setInterval(() => {
      // Hold still while the lightbox is open so its arrows step from the photo on screen.
      if (document.body.classList.contains('lb-open')) return;
      setSelectedPhotoIdx((prev) => {
        if (prev + 1 >= album.photos.length) {
          setSelectedAlbumIdx((prevAlbum) => (prevAlbum + 1) % albums.length);
          return 0;
        }
        return prev + 1;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [albums, albumIdx, isHovered]);

  const selectAlbum = (idx: number) => {
    setSelectedAlbumIdx(idx);
    setSelectedPhotoIdx(0);
  };

  /** Steps one photo forward or back within the current album, wrapping at either end. */
  const stepPhoto = (dir: 1 | -1) => {
    const count = photos.length;
    if (count === 0) return;
    setSelectedPhotoIdx((selectedPhotoIdx + dir + count) % count);
  };

  const nextPhoto = () => stepPhoto(1);
  const prevPhoto = () => stepPhoto(-1);

  return {
    albums,
    selectedAlbumIdx: albumIdx,
    selectedPhotoIdx,
    currentAlbum,
    currentPhoto,
    isHovered,
    setIsHovered,
    selectAlbum,
    nextPhoto,
    prevPhoto,
  };
}

export type GalleryHandler = ReturnType<typeof useGalleryHandler>;
export default useGalleryHandler;
