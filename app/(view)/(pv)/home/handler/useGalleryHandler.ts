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

  return {
    galleryAlbums,
    selectedAlbumIdx,
    selectedPhotoIdx,
    currentAlbum,
    currentPhoto,
    isHovered,
    setIsHovered,
    selectAlbum,
  };
}

export type GalleryHandler = ReturnType<typeof useGalleryHandler>;
export default useGalleryHandler;
