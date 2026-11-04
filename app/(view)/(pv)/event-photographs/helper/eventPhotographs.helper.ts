import type { HomeGalleryAlbum } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

/** A photo as the viewer shows it, with the album it is from. */
export interface ViewerPhoto {
  image: string;
  caption: string;
  album: string;
}

export const eventPhotographsHelper = {
  /** "Honours & News Makers" → "honours-news-makers", unique among the albums by its place. */
  albumId: (album: HomeGalleryAlbum, index: number) =>
    `${album.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'album'}-${index + 1}`,

  /** "4 photos", "1 photo". */
  photoCount: (count: number) => `${count} ${count === 1 ? 'photo' : 'photos'}`,

  /** "Annual Lunch 2025  ·  2 of 7", under the photo in the viewer. */
  position: (photo: ViewerPhoto, index: number, total: number) => `${photo.album}  ·  ${index + 1} of ${total}`,
};
