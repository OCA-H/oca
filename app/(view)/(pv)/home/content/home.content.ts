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
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5" stroke="#fff" stroke-width="1.4"/></svg>',
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
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" stroke="#fff" stroke-width="1.4"/><path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" stroke="#fff" stroke-width="1.4"/></svg>',
    photos: [
      { cap: 'Brother Foley Memorial, first day', src: U + '2022/10/Bro-Foley-Cricket-2022.jpg' },
      { cap: 'The sponsorship appeal', src: U + '2022/11/sponsor-new.jpg' },
    ],
  },
  {
    name: 'Honours & News Makers',
    time: 'Ongoing',
    tone: 'duo-gold',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="#fff" stroke-width="1.4"/></svg>',
    photos: [
      { cap: 'Justice D. Y. Chandrachud, Batch of 1975', src: U + '2022/10/Chadrachud-Congrats-web.jpg' },
      { cap: 'The Association crest', src: '/images/oca-crest.png' },
    ],
  },
  {
    name: 'Executive Committee',
    time: '2023 – 25',
    tone: 'duo-navy',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#fff" stroke-width="1.4"/></svg>',
    photos: [
      { cap: 'Santosh V. Kalyani, President', src: U + '2022/02/SVK-Profile-Pic-n.png' },
      { cap: 'Anurag Aggarwal, Secretary', src: U + '2022/05/Anurag-agarawal-n-1.png' },
      { cap: 'Kuwar Pranav Pratap Uppal, Treasurer', src: U + '2020/02/Pranav-Uppal.jpg' },
    ],
  },
];
