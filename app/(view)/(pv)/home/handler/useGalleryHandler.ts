'use client';

import { useState, useEffect } from 'react';
import { galleryAlbums, GalleryAlbum, GalleryPhoto } from '../content/home.content';

export function useGalleryHandler() {
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState(0);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentAlbum: GalleryAlbum = galleryAlbums[selectedAlbumIdx] || galleryAlbums[0];
  const currentPhoto: GalleryPhoto = currentAlbum.photos[selectedPhotoIdx] || currentAlbum.photos[0];

  useEffect(() => {
    if (isHovered) return;
    const album = galleryAlbums[selectedAlbumIdx];
    if (!album) return;

    const timer = setInterval(() => {
      // Hold still while the lightbox is open so its arrows step from the photo on screen.
      if (document.body.classList.contains('lb-open')) return;
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

  const selectAlbum = (idx: number) => {
    setSelectedAlbumIdx(idx);
    setSelectedPhotoIdx(0);
  };

  /** Steps one photo forward or back within the current album, wrapping at either end. */
  const stepPhoto = (dir: 1 | -1) => {
    const count = currentAlbum.photos.length;
    setSelectedPhotoIdx((selectedPhotoIdx + dir + count) % count);
  };

  const nextPhoto = () => stepPhoto(1);
  const prevPhoto = () => stepPhoto(-1);

  return {
    galleryAlbums,
    selectedAlbumIdx,
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
