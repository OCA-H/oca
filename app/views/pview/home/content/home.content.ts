export interface GalleryPhoto {
  cap: string;
  src: string;
}

export interface GalleryAlbum {
  name: string;
  time: string;
  tone: string;
  icon: string;
  photos: GalleryPhoto[];
}

const U = 'https://www.oldcolumban.net/wp-content/uploads/';

export const galleryAlbums: GalleryAlbum[] = [
  {
    name: 'Annual Lunch 2025',
    time: 'Nov 2025',
    tone: 'duo-navy',
    icon: '🏛️',
    photos: [
      { cap: 'Columbans of every batch', src: U + '2025/12/annual-lunch.jpg' },
      { cap: 'Old boys, reunited', src: U + '2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg' },
      { cap: 'Gathering at the Secretariat', src: U + '2023/02/IMG_1792.jpg' },
      { cap: 'Raising a glass to the School', src: U + '2020/03/hp2-donate-image.jpg' },
    ],
  },
  {
    name: 'OCA Sports',
    time: '2022',
    tone: 'duo-teal',
    icon: '🏏',
    photos: [
      { cap: 'Brother Foley Memorial, first day', src: U + '2022/10/Bro-Foley-Cricket-2022.jpg' },
      { cap: 'The sponsorship appeal', src: U + '2022/11/sponsor-new.jpg' },
    ],
  },
  {
    name: 'Honours & News Makers',
    time: 'Ongoing',
    tone: 'duo-gold',
    icon: '⭐',
    photos: [
      { cap: 'Justice D. Y. Chandrachud, Batch of 1975', src: U + '2022/10/Chadrachud-Congrats-web.jpg' },
      { cap: 'The Association crest', src: U + '2016/03/OCA_Newsletter-Volume11.jpg' },
    ],
  },
];
