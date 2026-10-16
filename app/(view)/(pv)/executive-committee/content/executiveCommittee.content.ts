import { ROUTES } from '@/app/(view)/common/helper/routes';

export interface OfficeBearer {
  name: string;
  role: string;
  roleSub?: string;
  batch: string;
  email?: string;
  photo?: string;
  photoAlt?: string;
  initials?: string;
  profession?: string;
}

export interface CommitteeMember {
  initials?: string;
  name: string;
  batch: string;
  role: string;
  roleSub?: string;
  profession?: string;
  email?: string;
}

export interface CommitteeTerm {
  id: string;
  jumpLabel: string;
  isCurrent?: boolean;
  eyebrow: string;
  title: string;
  pill?: string;
  tintClass?: string;
  isFourColumns?: boolean;
  officeBearers: OfficeBearer[];
  members: CommitteeMember[];
}

export interface ExecutiveCommitteeContent {
  breadcrumbs: {
    homeLabel: string;
    parentLabel: string;
    currentLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryBtn: {
      text: string;
      href: string;
    };
    secondaryBtn: {
      text: string;
      href: string;
    };
    image: string;
    imageAlt: string;
    caption: string;
  };
  jumpAriaLabel: string;
  terms: CommitteeTerm[];
  cta: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryBtn: {
      text: string;
      href: string;
    };
    secondaryBtn: {
      text: string;
      href: string;
    };
  };
}

export const executiveCommitteeContent: ExecutiveCommitteeContent = {
  breadcrumbs: {
    homeLabel: 'Home',
    parentLabel: 'About OCA',
    currentLabel: 'Executive Committee',
  },
  hero: {
    eyebrow: 'Governance',
    title: 'Executive Committee',
    lead: 'The leaders who guide OCA’s mission and strengthen the Columban community.',
    primaryBtn: {
      text: 'Join the OCA community',
      href: ROUTES.MEMBERSHIP,
    },
    secondaryBtn: {
      text: 'Read our mission',
      href: ROUTES.VISION_MISSION,
    },
    image: 'https://www.oldcolumban.net/wp-content/uploads/2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg',
    imageAlt: 'Columbans gathered at an Association event',
    caption: 'The Association at work',
  },
  jumpAriaLabel: 'Committee term jump links',
  terms: [
    {
      id: 'ec-2025-27',
      jumpLabel: '2025 – 2027',
      isCurrent: true,
      eyebrow: 'Current committee',
      title: 'Executive Committee of 2025 – 2027',
      pill: 'Current term',
      officeBearers: [
        {
          name: 'Samir Chopra',
          role: 'PRESIDENT',
          batch: 'Batch of 1983',
          initials: 'SC',
        },
        {
          name: 'Sudip Kohli',
          role: 'SECRETARY',
          batch: 'Batch of 1983',
          initials: 'SK',
        },
        {
          name: 'Sanjay Hans',
          role: 'TREASURER',
          batch: 'Batch of 1982',
          initials: 'SH',
          profession: 'Business',
          email: 'hanssanjay@gmail.com',
        },
      ],
      members: [],
    },
    {
      id: 'ec-2023-25',
      jumpLabel: '2023 – 2025',
      eyebrow: 'Previous committee',
      title: 'Executive Committee of 2023 – 2025',
      officeBearers: [
        {
          name: 'Santosh V. Kalyani',
          role: 'PRESIDENT',
          batch: 'Batch of 1990',
          photo: 'https://www.oldcolumban.net/wp-content/uploads/2022/02/SVK-Profile-Pic-n.png',
          photoAlt: 'Santosh V. Kalyani, President',
          email: 'sirsantosh123@gmail.com',
        },
        {
          name: 'Anurag Aggarwal',
          role: 'SECRETARY',
          batch: 'Batch of 2002',
          photo: 'https://www.oldcolumban.net/wp-content/uploads/2022/05/Anurag-agarawal-n-1.png',
          photoAlt: 'Anurag Aggarwal, Secretary',
          email: 'aggarwalanurag@yahoo.com',
        },
        {
          name: 'Kunwar Pranav Pratap Uppal',
          role: 'TREASURER',
          batch: 'Batch of 1989',
          photo: 'https://www.oldcolumban.net/wp-content/uploads/2020/02/Pranav-Uppal.jpg',
          photoAlt: 'Kunwar Pranav Pratap Uppal, Treasurer',
          email: 'pranav.uppal@ndeh.com',
        },
      ],
      members: [
        {
          initials: 'VA',
          name: 'Varun Aggarwal',
          batch: 'Batch of 1972',
          role: 'EC MEMBER',
          email: 'varunagga@hotmail.com',
        },
        {
          initials: 'VP',
          name: 'Dr. Vishal Pandit',
          batch: 'Batch of 1990',
          role: 'EC MEMBER',
          email: 'drvishalpandit@gmail.com',
        },
        {
          initials: 'HN',
          name: 'Harbinder Singh Narula',
          batch: 'Batch of 1991',
          role: 'EC MEMBER',
          email: 'harbindernarula@gmail.com',
        },
        {
          initials: 'RG',
          name: 'Rahul Grover',
          batch: 'Batch of 1991',
          role: 'EC MEMBER',
          email: 'rahulgrover13@yahoo.com',
        },
        {
          initials: 'KP',
          name: 'Kaustubh Prasad',
          batch: 'Batch of 1998',
          role: 'EC MEMBER',
          email: 'kaustubh@kaustubh.com',
        },
        {
          initials: 'AS',
          name: 'Amit Sadh',
          batch: 'Batch of 2002',
          role: 'EC MEMBER',
          email: 'amit_sadh@yahoo.com',
        },
        {
          initials: 'MA',
          name: 'Monce C. Abraham',
          batch: 'Batch of 2003',
          role: 'EC MEMBER',
          email: 'monce@thev.group',
        },
        {
          initials: 'KT',
          name: 'Karan Thakur',
          batch: 'Batch of 2007',
          role: 'EC MEMBER',
          email: 'karanthakur@hotmail.com',
        },
        {
          initials: 'RS',
          name: 'Rachit Singhal',
          batch: 'Batch of 2010',
          role: 'EC MEMBER',
          email: 'rachitsinghal@outlook.com',
        },
        {
          initials: 'PK',
          name: 'Parvinder Singh Kohli',
          batch: 'Batch of 1968',
          role: 'IMM. PAST PRESIDENT',
          email: 'pskohli@enkaycondominiums.com',
        },
        {
          initials: 'AK',
          name: 'Arun Khanna',
          batch: 'Batch of 1969',
          role: 'IMM. PAST PRESIDENT',
          email: 'arun.khanna@claridges.com',
        },
        {
          initials: 'RF',
          name: 'Bro Robert Fernandes',
          batch: 'Patron of the Association',
          role: 'PATRON',
          email: 'principal@stcolumbas.edu.in',
        },
      ],
    },
    {
      id: 'ec-2021-23',
      jumpLabel: '2021 – 2023',
      eyebrow: 'Previous committee',
      title: 'Executive Committee of 2021 – 2023',
      tintClass: 'tint-teal',
      officeBearers: [
        {
          initials: 'PK',
          name: 'Parvinder Singh Kohli',
          role: 'PRESIDENT',
          batch: 'Batch of 1968',
          profession: 'Business',
          email: 'pskohli@enkaycondominiums.com',
        },
        {
          initials: 'AB',
          name: 'Amit Bansal',
          role: 'SECRETARY',
          batch: 'Batch of 1992',
          profession: 'Business',
          email: 'amit@ramkishorechemicals.com',
        },
        {
          initials: 'KU',
          name: 'Kunwar Pranav Pratap Uppal',
          role: 'TREASURER',
          batch: 'Batch of 1989',
          profession: 'Business',
          email: 'pranav.uppal@ndeh.com',
        },
      ],
      members: [
        {
          initials: 'AC',
          name: 'Aditya Mohan Chug',
          batch: 'Batch of 1993',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'pwtltd@gmail.com',
        },
        {
          initials: 'AS',
          name: 'Ajay Singh',
          batch: 'Batch of 1984',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'ajay.singh@spicejet.com',
        },
        {
          initials: 'AG',
          name: 'Anil Gambhir',
          batch: 'Batch of 1967',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'anil@gsss.co.in',
        },
        {
          initials: 'DK',
          name: 'Deep Kalra',
          batch: 'Batch of 1987',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'Dk@go-mmt.com',
        },
        {
          initials: 'RM',
          name: 'Rajan Malhotra',
          batch: 'Batch of 1972',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'malhotrarajan@hotmail.com',
        },
        {
          initials: 'SH',
          name: 'Sanjay Hans',
          batch: 'Batch of 1982',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'hanssanjay@gmail.com',
        },
        {
          initials: 'SK',
          name: 'Santosh V Kalyani',
          batch: 'Batch of 1990',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'sirsantosh123@gmail.com',
        },
        {
          initials: 'BP',
          name: 'Bennet Aloysius Pinto',
          batch: 'Batch of 1976',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'bennet1976@gmail.com',
        },
        {
          initials: 'YS',
          name: 'Yogesh Sachdeva',
          batch: 'Batch of 1985',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'Ysachdeva@axiscomputech.in',
        },
        {
          initials: 'AS',
          name: 'Amit Sadh',
          batch: 'Batch of 2002',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'amit_sadh@yahoo.com',
        },
        {
          initials: 'AK',
          name: 'Arun Khanna',
          batch: 'Batch of 1969',
          role: 'IMM. PAST PRESIDENT',
          profession: 'Business',
          email: 'arun.khanna@claridges.com',
        },
        {
          initials: 'RF',
          name: 'Bro Robert Fernandes',
          batch: 'Patron of the Association',
          role: 'PATRON',
          profession: 'Principal',
          email: 'principal@stcolumbas.edu.in',
        },
      ],
    },
    {
      id: 'ec-2019-21',
      jumpLabel: '2019 – 2021',
      eyebrow: 'Previous committee',
      title: 'Executive Committee of 2019 – 2021',
      isFourColumns: true,
      officeBearers: [
        {
          initials: 'AK',
          name: 'Arun Khanna',
          role: 'PRESIDENT',
          batch: 'Batch of 1969',
          profession: 'Business',
          email: 'arun.khanna@claridges.com',
        },
        {
          initials: 'KK',
          name: 'Karan Khanna',
          role: 'SECRETARY',
          roleSub: '(till July 2020)',
          batch: 'Batch of 1976',
          profession: 'Chartered Accountant',
          email: 'mlkktax@gmail.com',
        },
        {
          initials: 'BP',
          name: 'Bennet Aloysius Pinto',
          role: 'EC MEMBER SECRETARY',
          roleSub: '(from July 2020)',
          batch: 'Batch of 1976',
          profession: 'Professional',
          email: 'bennet1976@gmail.com',
        },
        {
          initials: 'SC',
          name: 'Sumant Chadha',
          role: 'TREASURER',
          batch: 'Batch of 1980',
          profession: 'Chartered Accountant',
          email: 'sumant@trchadha.com',
        },
      ],
      members: [
        {
          initials: 'PK',
          name: 'Parvinder Singh Kohli',
          batch: 'Batch of 1968',
          role: 'IMM. PAST PRESIDENT',
          profession: 'Business',
          email: 'pskohli@enkaycondominiums.com',
        },
        {
          initials: 'SB',
          name: 'Sanjay Bhatia',
          batch: 'Batch of 1986',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 's_anj_u@hotmail.com',
        },
        {
          initials: 'DK',
          name: 'Deep Kalra',
          batch: 'Batch of 1987',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'dk@makemytrip.com',
        },
        {
          initials: 'AB',
          name: 'Amit Bansal',
          batch: 'Batch of 1993',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'amit@ramkishorechemicals.com',
        },
        {
          initials: 'AC',
          name: 'Aditya Chugh',
          batch: 'Batch of 1993',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'aditya.chugh@ymail.com',
        },
        {
          initials: 'AA',
          name: 'Anurag Aggarwal',
          batch: 'Batch of 2002',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'aggarwalanurag@yahoo.com',
        },
        {
          initials: 'DG',
          name: 'Dhruv Galgotia',
          batch: 'Batch of 2005',
          role: 'EC MEMBER',
          profession: 'Business',
          email: 'ceo@galgotiasuniversity.edu',
        },
        {
          initials: 'JE',
          name: 'Jai Sahai Endlaw',
          batch: 'Batch of 2008',
          role: 'EC MEMBER',
          profession: 'Professional',
          email: 'jaisahai@gmail.com',
        },
        {
          initials: 'EM',
          name: 'Bro. E V Miranda',
          batch: 'Patron of the Association',
          role: 'PATRON',
          profession: 'Principal',
          email: 'principal@stcolumbas.edu.in',
        },
      ],
    },
  ],
  cta: {
    eyebrow: 'Get involved',
    title: 'Join the OCA community',
    lead: 'Members elect the committee, stand for it, and shape what the Association does next.',
    primaryBtn: {
      text: 'Become a Member',
      href: ROUTES.MEMBERSHIP,
    },
    secondaryBtn: {
      text: 'Support OCA',
      href: ROUTES.DONATION,
    },
  },
};
