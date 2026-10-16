import { ROUTES } from '@/app/(view)/common/helper/route';

export interface ContributionHead {
  id: string;
  label: string;
  note?: string;
  isWarn?: boolean;
}

export interface PaymentOption {
  id: string;
  label: string;
  desc: string;
}

export interface ImpactCell {
  num: string;
  title: string;
  description: string;
}

export interface TrustCell {
  icon: 'secure' | 'accounted' | 'talk';
  title: string;
  description: string;
}

export interface DonationContent {
  breadcrumbs: {
    home: string;
    current: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  aside: {
    eyebrow: string;
    title: string;
    description: string;
    quote: string;
    quoteWho: string;
    links: {
      text: string;
      href: string;
    }[];
  };
  heads: ContributionHead[];
  perTeacherAmount: number;
  amountPresets: number[];
  teacherOptions: string[];
  batches: string[];
  countries: string[];
  paymentOptions: PaymentOption[];
  terms: string[];
  impact: {
    eyebrow: string;
    title: string;
    lead: string;
    cells: ImpactCell[];
  };
  featuredCause: {
    eyebrow: string;
    title: string;
    description: string;
    percent: number;
    collected: string;
    target: string;
    image: string;
    caption: string;
    primaryBtn: {
      text: string;
      href: string;
    };
    secondaryBtn: {
      text: string;
      href: string;
    };
    asks: {
      title: string;
      budget: string;
      icon: 'renovation' | 'cricket';
    }[];
  };
  trust: {
    eyebrow: string;
    title: string;
    cells: TrustCell[];
  };
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

export const donationContent: DonationContent = {
  breadcrumbs: {
    home: 'Home',
    current: 'Contribute',
  },
  hero: {
    eyebrow: 'Contribute',
    title: 'Make a contribution',
    lead: 'Your contribution helps strengthen opportunities for students and preserve the Columban legacy.',
  },
  aside: {
    eyebrow: 'Why contribute',
    title: 'A school gave you a start. This is how it gets paid forward.',
    description:
      'Columbans have carried this Association since 1941 — not through endowments, but through old boys deciding, one at a time, that the School was worth standing behind.',
    quote:
      'Our prime objective is assisting the School with funds, amenities and inputs from the alumni.',
    quoteWho: 'From the objects of the Association',
    links: [
      { text: 'Know more about OCA →', href: ROUTES.VISION_MISSION },
      { text: 'Become a member →', href: ROUTES.MEMBERSHIP },
      { text: 'Who administers the funds →', href: ROUTES.EXECUTIVE_COMMITTEE },
    ],
  },
  heads: [
    { id: 'tbf', label: 'Teachers Benevolent Fund' },
    { id: 'sponsor', label: 'Sponsor a teacher', note: '₹5,000 per teacher' },
    { id: 'general', label: 'General Contribution' },
    { id: 'secretariat', label: 'OCA Secretariat Contribution' },
    {
      id: 'breakfast',
      label: 'OCA Breakfast Programme',
      note: 'Currently suspended',
      isWarn: true,
    },
  ],
  perTeacherAmount: 5000,
  amountPresets: [1100, 5100, 11000, 51000],
  teacherOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  batches: [
    '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017',
    '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007',
    '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997',
    '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987',
    '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977',
    '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967',
    '1966', '1965', '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957',
    '1956', '1955', '1954', '1953', '1952', '1951', '1950', '1949', '1948', '1947',
    '1946', '1945', '1944', '1943', '1942', '1941',
  ],
  countries: [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
    'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
    'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
    'Central African Republic (CAR)', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
    'Democratic Republic of the Congo', 'Republic of the Congo', 'Costa Rica',
    "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
    'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
    'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
    'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi',
    'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
    'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
    'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
    'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates (UAE)',
    'United Kingdom (UK)', 'United States of America (USA)', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City (Holy See)', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia',
    'Zimbabwe',
  ],
  paymentOptions: [
    { id: 'upi', label: 'UPI', desc: 'Any Indian bank app' },
    { id: 'card', label: 'Card', desc: 'Indian debit or credit' },
    { id: 'netbanking', label: 'Net banking', desc: 'From your bank account' },
    { id: 'transfer', label: 'Bank transfer', desc: 'Details sent by email' },
  ],
  terms: [
    'All payments are accepted in Indian Rupees only.',
    'International debit or credit cards and international bank transfers are not accepted.',
    'All donors can avail the benefit of 80G under section 12(a) of the Income Tax Act, 1961.',
  ],
  impact: {
    eyebrow: 'Our Social Conscience',
    title: 'Every contribution creates possibilities',
    lead: 'The Association’s prime objective is assisting the School with funds, amenities and inputs from the alumni. Here is where that goes.',
    cells: [
      {
        num: '01',
        title: 'Education',
        description:
          'Teaching resources, the School magazine and the academic programmes the Association helps underwrite.',
      },
      {
        num: '02',
        title: 'Student support',
        description:
          'Help for students who need it, and the sponsorship programmes the Association is preparing.',
      },
      {
        num: '03',
        title: 'School development',
        description:
          'Amenities and infrastructure at Ashoka Place, including the OCA Centre and Secretariat renovation.',
      },
      {
        num: '04',
        title: 'Community initiatives',
        description:
          'Memorial cricket tournaments, sports, reunions and the events that keep Columbans in contact.',
      },
    ],
  },
  featuredCause: {
    eyebrow: 'Featured cause',
    title: 'The Teachers Benevolent Fund',
    description:
      'The teachers who taught us are still ours to look after. This fund is the Association’s standing commitment to the staff of St. Columba’s School, and it is the first place a general contribution goes.',
    percent: 7,
    collected: '₹15,68,928',
    target: '₹2,00,00,000',
    image: 'https://www.oldcolumban.net/wp-content/uploads/2023/02/IMG_1792.jpg',
    caption:
      'The Teachers Benevolent Fund stands behind the staff who spent their careers at the School.',
    primaryBtn: {
      text: 'Contribute to this fund',
      href: '#give-form',
    },
    secondaryBtn: {
      text: 'About the fund',
      href: ROUTES.TEACHERS_BENEVOLENT_FUND,
    },
    asks: [
      {
        title: 'OCA Centre & Secretariat renovation',
        budget: 'Budget ₹20 lacs sponsorship solicited',
        icon: 'renovation',
      },
      {
        title: 'Brother Oman Memorial Cricket Tournament',
        budget: '₹1.50 lacs sponsorship solicited',
        icon: 'cricket',
      },
    ],
  },
  trust: {
    eyebrow: 'Before you give',
    title: 'What happens to your contribution',
    cells: [
      {
        icon: 'secure',
        title: 'Secure payment',
        description:
          'Payments are processed through the Association’s payment gateway. OCA does not store your card or banking details.',
      },
      {
        icon: 'accounted',
        title: 'Accounted for, openly',
        description:
          'Funds are held by the Treasurer and presented in the audited balance sheet at each Annual General Meeting, circulated to all members.',
      },
      {
        icon: 'talk',
        title: 'Talk to us first',
        description:
          'Call the Secretariat on 011-23748666 or write to info@oldcolumban.net. St. Columba’s School, Ashoka Place, New Delhi – 110 001.',
      },
    ],
  },
  cta: {
    eyebrow: 'Another way to help',
    title: 'Membership is the longest contribution of all',
    lead: 'Lifetime members carry the Association year after year, not just once.',
    primaryBtn: {
      text: 'Become a Member',
      href: ROUTES.MEMBERSHIP,
    },
    secondaryBtn: {
      text: 'Know more about OCA',
      href: ROUTES.VISION_MISSION,
    },
  },
};
