// The gallery's albums are edited in the admin panel (Home page → Our Gallery); see siteDefaults.ts.

/** The duotone each album's stage shows while a photo loads, taken in turn by album position. */
export const GALLERY_TONES = ['duo-navy', 'duo-teal', 'duo-gold'] as const;

export const galleryTone = (albumIdx: number): string => GALLERY_TONES[albumIdx % GALLERY_TONES.length];
