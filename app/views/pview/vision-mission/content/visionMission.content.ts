import { ROUTES } from '@/app/views/common/helper/route';

export interface ObjectiveItem {
  num: string;
  title: string;
  text: string;
}

export const visionMissionContent = {
  hero: {
    eyebrow: 'About OCA',
    title: 'Vision & Mission',
    lead: 'Connecting generations of Columbans through fellowship, service, and commitment to our alma mater.',
    primaryBtn: { text: 'Become a Member', href: ROUTES.MEMBERSHIP },
    secondaryBtn: { text: 'Support our initiatives', href: ROUTES.DONATION },
    image: '/images/annual-lunch.jpg',
    imageAlt: 'Columbans of every batch at the OCA Annual Lunch Get Together',
  },
  whoWeAre: {
    eyebrow: 'Since 1941',
    title: 'An association founded by Columbans, for Columbans',
    paragraphs: [
      'The Old Columbans Association is a mutual benefit association founded by the ex-students of St. Columba’s School, New Delhi, in association with the Management of the School.',
      'It is eternally guided by the School motto, which the Association continues to enshrine in its spirit and ethos.',
    ],
    motto: {
      latin: ['Sapere aude', 'sincere et constanter'],
      trans: 'Dare to be wise, sincere and constant.',
      caption: 'The motto of St. Columba’s School',
    },
  },
  vision: {
    eyebrow: 'Our Vision',
    quote: 'Our vision is to build a connected global Columban community.',
    after:
      'Wherever a Columban settles — Delhi, Dubai, London or Toronto — the Association exists so that the thread back to Ashoka Place is never lost. Chapters, batch coordinators and a maintained roll of members are how that thread is held.',
  },
  mission: {
    eyebrow: 'Our Mission',
    title: 'To praise, promote and protect St. Columba’s School',
    paragraphs: [
      'To praise, promote and protect St. Columba’s School and its students, and to unite, inform and involve alumni and friends in a fraternity of fellowship and support for each other and the school.',
      'OCA connects its members to each other, and to the past, present and future of St. Columba’s School.',
    ],
    buttonText: 'Meet the Executive Committee',
    buttonHref: ROUTES.EXECUTIVE_COMMITTEE,
    image: '/images/IMG_1792.jpg',
    imageAlt: 'The OCA Secretariat at St. Columba’s School',
    caption: 'The OCA Secretariat at St. Columba’s School, Ashoka Place, New Delhi.',
  },
  objectives: {
    eyebrow: 'Our Objectives',
    title: 'What the Association has set itself to do',
    subtitle: 'Drawn from the ByLaws of the Association, and the work the Secretariat carries out each year.',
    items: [
      {
        num: '01',
        title: 'Fellowship & community',
        text: 'To act as an institutional vehicle and a centre for promoting fellowship, fraternity, friendship and understanding amongst ex-students of the School, and between ex-students and the School.',
      },
      {
        num: '02',
        title: 'Supporting the School',
        text: 'To undertake activities for the growth, welfare and prosperity of St. Columba’s School and its staff, students and employees — from the Teachers Benevolent Fund to amenities and infrastructure.',
      },
      {
        num: '03',
        title: 'Alumni engagement',
        text: 'To organise social, cultural and professional events that give students, ex-students, staff and employees an institutional forum for the exchange of views.',
      },
      {
        num: '04',
        title: 'Knowledge sharing',
        text: 'To organise, facilitate and sponsor talks, lectures, seminars, workshops and get-togethers on subjects of relevance to the School and its community, and to disseminate news of Columban achievement.',
      },
      {
        num: '05',
        title: 'Social responsibility',
        text: 'To advise and contribute to academic excellence, moral integrity and independent, inquiring dispositions among students regardless of religion, caste or creed — and to promote sport of all kinds.',
      },
      {
        num: '06',
        title: 'A record that is kept',
        text: 'To create and maintain an information database of ex-students, and to provide a forum for free and frank exchange of views on all matters relating to the School and its members.',
      },
    ] as ObjectiveItem[],
    formNote: 'The objectives are set out in full in the ',
    formNoteLinkText: 'ByLaws of OCA',
    formNoteHref: ROUTES.BYLAWS,
  },
  socialConscience: {
    eyebrow: 'OCA Social Conscience',
    title: 'Where the mission becomes practical',
    paragraph:
      'The Association’s prime objective is assisting the School with funds, amenities and inputs from the alumni. The Teachers Benevolent Fund stands behind the staff who spent their careers at Ashoka Place; memorial cricket tournaments keep Columban sport alive; the Secretariat keeps the record.',
    buttonText: 'Support our initiatives',
    buttonHref: ROUTES.DONATION,
    image: '/images/hp2-donate-image.jpg',
    imageAlt: 'Support for St. Columba’s School and its teachers',
    caption: 'The Teachers Benevolent Fund — the Association’s standing commitment to the staff of the School.',
  },
  cta: {
    eyebrow: 'Join us',
    title: 'Be part of the Columban legacy',
    lead: 'Lifetime membership keeps you on the roll, in the directory, and in touch with Columbans of every batch.',
    btnGold: { text: 'Become a Member', href: ROUTES.MEMBERSHIP },
    btnSecondary: { text: 'Support OCA', href: ROUTES.DONATION },
  },
};
