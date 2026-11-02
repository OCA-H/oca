import {
  SITE_SECTION_KEYS,
  type ContactDetailsContent,
  type EmailSettingsContent,
  type MembershipFeeContent,
  type EventDinnerContent,
  type EventGolfContent,
  type EventLunchContent,
  type EventSportsContent,
  type HomeContent,
  type SiteSectionKey,
} from "../schema/sectionSpecs";

// What each section shows until an admin saves it: the content the home page was built with.

const U = "https://www.oldcolumban.net/wp-content/uploads/";
const NOTICE_IMAGE = U + "2016/03/OCA_Newsletter-Volume11.jpg";

export const HOME_DEFAULTS: HomeContent = {
  ticker: {
    badge: "● LIVE",
    items: [
      { label: "New notice:", text: "OCA – AGM 2025 Reminder & Balance Sheet posted Nov 19, 2025" },
      { label: "Sponsorship open:", text: "Brother Oman Memorial Cricket Tournament — ₹1.50 Lacs" },
      { label: "Fund update:", text: "Teachers Benevolent Fund now at 7% of goal" },
    ],
  },

  events: {
    eyebrow: "On the calendar",
    title: "Upcoming Events",
    intro: "Inviting well-connected Columbans of all batches to take responsibility and leadership as \"Batch Coordinators.\" Email us at info@oldcolumban.net.",
    items: [
      {
        image: U + "2025/12/annual-lunch.jpg",
        imageAlt: "OCA Annual Dinner Get Together",
        dateChip: "18 DEC 2026",
        caption: "Annual Dinner",
        date: "Friday, 18 December 2026",
        title: "OCA – Annual Dinner Get Together",
        desc: "An evening with Columbans of every batch, at the Qutub Golf Course.",
        ctaLabel: "View Details →",
        ctaHref: "/annual-dinner",
      },
      {
        image: U + "2022/10/Bro-Foley-Cricket-2022.jpg",
        imageAlt: "Brother Foley Memorial Interschool Cricket Tournament",
        dateChip: "DEC 2022",
        caption: "Cricket Tournament",
        date: "Dec 2022 – Jan 2023",
        title: "Brother Foley Memorial Interschool Cricket Tournament",
        desc: "An interschool cricket tournament held in memory of Brother Foley.",
        ctaLabel: "View Details →",
        ctaHref: "/sports",
      },
      {
        image: U + "2022/11/sponsor-new.jpg",
        imageAlt: "Sponsorship appeal for the Brother Oman Memorial Tournament",
        dateChip: "SPONSORSHIP: ₹1.5L",
        caption: "Cricket Tournament",
        date: "Sponsorship: ₹1.50 Lacs",
        title: "Brother Oman Memorial Interschool Cricket Tournament",
        desc: "Principal's appeal for sponsorship of this memorial tournament.",
        ctaLabel: "View Details →",
        ctaHref: "/sports#sponsor",
      },
    ],
  },

  notices: {
    eyebrow: "OCA Notice Board",
    title: "News & Notice(s)",
    intro: "The latest word from the OCA Secretariat — AGM notices, elections and community updates.",
    updatedLabel: "Updated Nov 19, 2025",
    items: [
      { date: "November 19, 2025", title: "OCA – AGM 2025 Reminder & Balance Sheet" },
      { date: "October 31, 2025", title: "OCA – AGM and Election Notice 2025" },
      { date: "October 14, 2024", title: "OCA – AGM MOM 23rd April 2023" },
      { date: "September 25, 2024", title: "OCA AGM Notice to be held on 17th October, 2024" },
      { date: "March 10, 2023", title: "OCA – AGM and Election Notice 2023" },
      { date: "October 14, 2022", title: "Become members of the Old Columban Association – Principal Letter" },
    ].map((notice) => ({ ...notice, image: NOTICE_IMAGE, imageAlt: "OCA newsletter and notice", href: "" })),
  },

  spotlight: {
    eyebrow: "In the spotlight",
    title: "Columban Newsmakers",
    intro: "Columbans making the School proud across public life, business and the arts.",
    image: "/images/chandrachud-spotlight.png",
    imageAlt: "Congratulations to Justice Dr. D. Y. Chandrachud, Batch of 1975, on being appointed Chief Justice of India",
    pill: "News Makers · Achievers",
    headline: "Congratulating Columban Justice D. Y. Chandrachud",
    body: "OCA proudly celebrates fellow Columban Justice Dhananjaya Y. Chandrachud on his tenure as Chief Justice of India — one of many Columbans making the school proud across public life, business and the arts.",
    linkLabel: "See more News Makers →",
    linkHref: "/#news-makers",
  },

  hangout: {
    eyebrow: "OCA Hangout",
    title: "Photos & videos from the community",
    intro: "Cricket, lunches and reunions — posted live by batches around the world.",
    highlight: "posted live",
    posts: [
      { type: "video", images: [{ image: U + "2025/12/annual-lunch.jpg", imageAlt: "Annual Lunch highlights" }], video: "", duration: "2:14", name: "R. Kapoor", batch: "Batch '88", caption: "Annual Lunch highlights reel — what a turnout this year!", time: "2 days ago" },
      { type: "photo", images: [{ image: U + "2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg", imageAlt: "Columbans reunited" }], video: "", duration: "", name: "S. Mehta", batch: "Batch '95", caption: "Brotherhood, decades on. So good to see everyone again.", time: "3 days ago" },
      { type: "photo", images: [{ image: U + "2023/02/IMG_1792.jpg", imageAlt: "At the OCA Secretariat" }], video: "", duration: "", name: "A. Bose", batch: "Batch '79", caption: "Batch of '85 reunion — 40 years on and still causing trouble.", time: "5 days ago" },
      { type: "video", images: [{ image: U + "2022/10/Bro-Foley-Cricket-2022.jpg", imageAlt: "Cricket at the Brother Foley Memorial" }], video: "", duration: "0:48", name: "V. Trivedi", batch: "Batch '02", caption: "Cricket at the nets before Sports Day kicks off.", time: "1 week ago" },
      { type: "photo", images: [{ image: U + "2022/11/sponsor-new.jpg", imageAlt: "Tournament sponsorship" }], video: "", duration: "", name: "H. Khanna", batch: "Batch '91", caption: "Sports Day 2024 — the tug of war never disappoints.", time: "1 week ago" },
      { type: "photo", images: [{ image: U + "2020/03/hp2-donate-image.jpg", imageAlt: "Back on campus" }], video: "", duration: "", name: "P. Nair", batch: "Batch '00", caption: "Back on the old campus — the quad hasn't changed a bit.", time: "2 weeks ago" },
    ],
  },

  social: {
    eyebrow: "OCA Social Conscience",
    title: "Your help is very important",
    intro: "Our prime objective is assisting the School with funds, amenities and inputs from the alumni.",
    causes: [
      {
        status: "featured",
        image: U + "2020/03/hp2-donate-image.jpg",
        imageAlt: "Teachers Benevolent Fund",
        badge: "Featured Cause",
        title: "Teachers Benevolent Fund",
        desc: "",
        fund: "tbf",
        offlineRaised: 0,
        progress: 7,
        raised: "₹15,68,928",
        goal: "₹2,00,00,000",
        href: "/#teachers-benevolent-fund",
        ctaHref: "/donation#give-form",
      },
      {
        status: "muted",
        image: U + "2023/02/IMG_1792.jpg",
        imageAlt: "OCA Breakfast Programme",
        badge: "Suspended",
        title: "OCA Breakfast Programme",
        desc: "Currently suspended. We'll share an update here when the programme resumes.",
        fund: "",
        offlineRaised: 0,
        progress: 0,
        raised: "",
        goal: "",
        href: "",
        ctaHref: "",
      },
      {
        status: "muted",
        image: U + "2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg",
        imageAlt: "Support a Child programme",
        badge: "Coming Soon",
        title: "Support a Child",
        desc: "A new sponsorship programme is being prepared — check back soon.",
        fund: "",
        offlineRaised: 0,
        progress: 0,
        raised: "",
        goal: "",
        href: "",
        ctaHref: "",
      },
    ],
  },

  gallery: {
    eyebrow: "Our Gallery",
    title: "Moments from the OCA community",
    intro: "Browse by album — the story keeps playing, or jump straight to the one you want.",
    albums: [
      {
        name: "Annual Lunch 2025",
        time: "Nov 2025",
        photos: [
          { caption: "Columbans of every batch", image: U + "2025/12/annual-lunch.jpg" },
          { caption: "Old boys, reunited", image: U + "2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg" },
          { caption: "Gathering at the Secretariat", image: U + "2023/02/IMG_1792.jpg" },
          { caption: "Raising a glass to the School", image: U + "2020/03/hp2-donate-image.jpg" },
        ],
      },
      {
        name: "OCA Sports",
        time: "2022",
        photos: [
          { caption: "Brother Foley Memorial, first day", image: U + "2022/10/Bro-Foley-Cricket-2022.jpg" },
          { caption: "The sponsorship appeal", image: U + "2022/11/sponsor-new.jpg" },
        ],
      },
      {
        name: "Honours & News Makers",
        time: "Ongoing",
        photos: [
          { caption: "Justice D. Y. Chandrachud, Batch of 1975", image: U + "2022/10/Chadrachud-Congrats-web.jpg" },
          { caption: "The Association crest", image: "/images/oca-crest.png" },
        ],
      },
      {
        name: "Executive Committee",
        time: "2023 – 25",
        photos: [
          { caption: "Santosh V. Kalyani, President", image: U + "2022/02/SVK-Profile-Pic-n.png" },
          { caption: "Anurag Aggarwal, Secretary", image: U + "2022/05/Anurag-agarawal-n-1.png" },
          { caption: "Kuwar Pranav Pratap Uppal, Treasurer", image: U + "2020/02/Pranav-Uppal.jpg" },
        ],
      },
    ],
  },

  committee: {
    eyebrow: "Governance",
    title: "Executive Committee, 2025 – 27",
    terms: [
      {
        period: "2025 – 2027",
        title: "",
        eyebrow: "",
        pill: "",
        officeBearers: [
          { image: "", imageAlt: "", initials: "SC", name: "Samir Chopra", role: "PRESIDENT", roleSub: "", batch: "Batch of 1983", profession: "", email: "" },
          { image: "", imageAlt: "", initials: "SK", name: "Sudip Kohli", role: "SECRETARY", roleSub: "", batch: "Batch of 1983", profession: "", email: "" },
          { image: "", imageAlt: "", initials: "SH", name: "Sanjay Hans", role: "TREASURER", roleSub: "", batch: "Batch of 1982", profession: "", email: "" },
        ],
        members: [
          { name: "Ashish Ghosh", role: "EC MEMBER", roleSub: "", batch: "Batch of 1973", profession: "", email: "" },
          { name: "Rajeev Sabharwal", role: "EC MEMBER", roleSub: "", batch: "Batch of 1981", profession: "", email: "" },
          { name: "Vikram Bhalla", role: "EC MEMBER", roleSub: "", batch: "Batch of 1982", profession: "", email: "" },
          { name: "Vineet Chawla", role: "EC MEMBER", roleSub: "", batch: "Batch of 1982", profession: "", email: "" },
          { name: "Rohit Khanna", role: "EC MEMBER", roleSub: "", batch: "Batch of 1983", profession: "", email: "" },
          { name: "Mandeep Singh Anand", role: "EC MEMBER", roleSub: "", batch: "Batch of 1990", profession: "", email: "" },
          { name: "Aditya Mohan Chugh", role: "EC MEMBER", roleSub: "", batch: "Batch of 1993", profession: "", email: "" },
          { name: "Sunil Joseph Mathews", role: "EC MEMBER", roleSub: "", batch: "Batch of 1994", profession: "", email: "" },
          { name: "Jaideep Ahuja", role: "EC MEMBER", roleSub: "", batch: "Batch of 1994", profession: "", email: "" },
          { name: "Siddharth Dias", role: "EC MEMBER", roleSub: "", batch: "Batch of 1999", profession: "", email: "" },
          { name: "Aryan Mehra", role: "EC MEMBER", roleSub: "", batch: "Batch of 2019", profession: "", email: "" },
        ],
      },
      {
        period: "2023 – 2025",
        title: "",
        eyebrow: "",
        pill: "",
        officeBearers: [
          { image: "https://www.oldcolumban.net/wp-content/uploads/2022/02/SVK-Profile-Pic-n.png", imageAlt: "Santosh V. Kalyani, President", initials: "", name: "Santosh V. Kalyani", role: "PRESIDENT", roleSub: "", batch: "Batch of 1990", profession: "", email: "sirsantosh123@gmail.com" },
          { image: "https://www.oldcolumban.net/wp-content/uploads/2022/05/Anurag-agarawal-n-1.png", imageAlt: "Anurag Aggarwal, Secretary", initials: "", name: "Anurag Aggarwal", role: "SECRETARY", roleSub: "", batch: "Batch of 2002", profession: "", email: "aggarwalanurag@yahoo.com" },
          { image: "https://www.oldcolumban.net/wp-content/uploads/2020/02/Pranav-Uppal.jpg", imageAlt: "Kunwar Pranav Pratap Uppal, Treasurer", initials: "", name: "Kunwar Pranav Pratap Uppal", role: "TREASURER", roleSub: "", batch: "Batch of 1989", profession: "", email: "pranav.uppal@ndeh.com" },
        ],
        members: [
          { name: "Varun Aggarwal", role: "EC MEMBER", roleSub: "", batch: "Batch of 1972", profession: "", email: "varunagga@hotmail.com" },
          { name: "Dr. Vishal Pandit", role: "EC MEMBER", roleSub: "", batch: "Batch of 1990", profession: "", email: "drvishalpandit@gmail.com" },
          { name: "Harbinder Singh Narula", role: "EC MEMBER", roleSub: "", batch: "Batch of 1991", profession: "", email: "harbindernarula@gmail.com" },
          { name: "Rahul Grover", role: "EC MEMBER", roleSub: "", batch: "Batch of 1991", profession: "", email: "rahulgrover13@yahoo.com" },
          { name: "Kaustubh Prasad", role: "EC MEMBER", roleSub: "", batch: "Batch of 1998", profession: "", email: "kaustubh@kaustubh.com" },
          { name: "Amit Sadh", role: "EC MEMBER", roleSub: "", batch: "Batch of 2002", profession: "", email: "amit_sadh@yahoo.com" },
          { name: "Monce C. Abraham", role: "EC MEMBER", roleSub: "", batch: "Batch of 2003", profession: "", email: "monce@thev.group" },
          { name: "Karan Thakur", role: "EC MEMBER", roleSub: "", batch: "Batch of 2007", profession: "", email: "karanthakur@hotmail.com" },
          { name: "Rachit Singhal", role: "EC MEMBER", roleSub: "", batch: "Batch of 2010", profession: "", email: "rachitsinghal@outlook.com" },
          { name: "Parvinder Singh Kohli", role: "IMM. PAST PRESIDENT", roleSub: "", batch: "Batch of 1968", profession: "", email: "pskohli@enkaycondominiums.com" },
          { name: "Arun Khanna", role: "IMM. PAST PRESIDENT", roleSub: "", batch: "Batch of 1969", profession: "", email: "arun.khanna@claridges.com" },
          { name: "Bro Robert Fernandes", role: "PATRON", roleSub: "", batch: "Patron of the Association", profession: "", email: "principal@stcolumbas.edu.in" },
        ],
      },
      {
        period: "2021 – 2023",
        title: "",
        eyebrow: "",
        pill: "",
        officeBearers: [
          { image: "", imageAlt: "", initials: "", name: "Parvinder Singh Kohli", role: "PRESIDENT", roleSub: "", batch: "Batch of 1968", profession: "Business", email: "pskohli@enkaycondominiums.com" },
          { image: "", imageAlt: "", initials: "", name: "Amit Bansal", role: "SECRETARY", roleSub: "", batch: "Batch of 1992", profession: "Business", email: "amit@ramkishorechemicals.com" },
          { image: "", imageAlt: "", initials: "", name: "Kunwar Pranav Pratap Uppal", role: "TREASURER", roleSub: "", batch: "Batch of 1989", profession: "Business", email: "pranav.uppal@ndeh.com" },
        ],
        members: [
          { name: "Aditya Mohan Chug", role: "EC MEMBER", roleSub: "", batch: "Batch of 1993", profession: "Business", email: "pwtltd@gmail.com" },
          { name: "Ajay Singh", role: "EC MEMBER", roleSub: "", batch: "Batch of 1984", profession: "Professional", email: "ajay.singh@spicejet.com" },
          { name: "Anil Gambhir", role: "EC MEMBER", roleSub: "", batch: "Batch of 1967", profession: "Business", email: "anil@gsss.co.in" },
          { name: "Deep Kalra", role: "EC MEMBER", roleSub: "", batch: "Batch of 1987", profession: "Professional", email: "Dk@go-mmt.com" },
          { name: "Rajan Malhotra", role: "EC MEMBER", roleSub: "", batch: "Batch of 1972", profession: "Professional", email: "malhotrarajan@hotmail.com" },
          { name: "Sanjay Hans", role: "EC MEMBER", roleSub: "", batch: "Batch of 1982", profession: "Business", email: "hanssanjay@gmail.com" },
          { name: "Santosh V Kalyani", role: "EC MEMBER", roleSub: "", batch: "Batch of 1990", profession: "Professional", email: "sirsantosh123@gmail.com" },
          { name: "Bennet Aloysius Pinto", role: "EC MEMBER", roleSub: "", batch: "Batch of 1976", profession: "Professional", email: "bennet1976@gmail.com" },
          { name: "Yogesh Sachdeva", role: "EC MEMBER", roleSub: "", batch: "Batch of 1985", profession: "Professional", email: "Ysachdeva@axiscomputech.in" },
          { name: "Amit Sadh", role: "EC MEMBER", roleSub: "", batch: "Batch of 2002", profession: "Business", email: "amit_sadh@yahoo.com" },
          { name: "Arun Khanna", role: "IMM. PAST PRESIDENT", roleSub: "", batch: "Batch of 1969", profession: "Business", email: "arun.khanna@claridges.com" },
          { name: "Bro Robert Fernandes", role: "PATRON", roleSub: "", batch: "Patron of the Association", profession: "Principal", email: "principal@stcolumbas.edu.in" },
        ],
      },
      {
        period: "2019 – 2021",
        title: "",
        eyebrow: "",
        pill: "",
        officeBearers: [
          { image: "", imageAlt: "", initials: "", name: "Arun Khanna", role: "PRESIDENT", roleSub: "", batch: "Batch of 1969", profession: "Business", email: "arun.khanna@claridges.com" },
          { image: "", imageAlt: "", initials: "", name: "Karan Khanna", role: "SECRETARY", roleSub: "(till July 2020)", batch: "Batch of 1976", profession: "Chartered Accountant", email: "mlkktax@gmail.com" },
          { image: "", imageAlt: "", initials: "", name: "Bennet Aloysius Pinto", role: "EC MEMBER SECRETARY", roleSub: "(from July 2020)", batch: "Batch of 1976", profession: "Professional", email: "bennet1976@gmail.com" },
          { image: "", imageAlt: "", initials: "", name: "Sumant Chadha", role: "TREASURER", roleSub: "", batch: "Batch of 1980", profession: "Chartered Accountant", email: "sumant@trchadha.com" },
        ],
        members: [
          { name: "Parvinder Singh Kohli", role: "IMM. PAST PRESIDENT", roleSub: "", batch: "Batch of 1968", profession: "Business", email: "pskohli@enkaycondominiums.com" },
          { name: "Sanjay Bhatia", role: "EC MEMBER", roleSub: "", batch: "Batch of 1986", profession: "Business", email: "s_anj_u@hotmail.com" },
          { name: "Deep Kalra", role: "EC MEMBER", roleSub: "", batch: "Batch of 1987", profession: "Professional", email: "dk@makemytrip.com" },
          { name: "Amit Bansal", role: "EC MEMBER", roleSub: "", batch: "Batch of 1993", profession: "Business", email: "amit@ramkishorechemicals.com" },
          { name: "Aditya Chugh", role: "EC MEMBER", roleSub: "", batch: "Batch of 1993", profession: "Business", email: "aditya.chugh@ymail.com" },
          { name: "Anurag Aggarwal", role: "EC MEMBER", roleSub: "", batch: "Batch of 2002", profession: "Professional", email: "aggarwalanurag@yahoo.com" },
          { name: "Dhruv Galgotia", role: "EC MEMBER", roleSub: "", batch: "Batch of 2005", profession: "Business", email: "ceo@galgotiasuniversity.edu" },
          { name: "Jai Sahai Endlaw", role: "EC MEMBER", roleSub: "", batch: "Batch of 2008", profession: "Professional", email: "jaisahai@gmail.com" },
          { name: "Bro. E V Miranda", role: "PATRON", roleSub: "", batch: "Patron of the Association", profession: "Principal", email: "principal@stcolumbas.edu.in" },
        ],
      },
    ],
  },
};

export const DINNER_DEFAULTS: EventDinnerContent = {
  eyebrow: "Save the date",
  title: "OCA Annual Dinner",
  lead: "One evening, every batch. Come for the reunion, stay for the stories — the Columban family is gathering at the Qutub Golf Course.",
  image: "/images/annual-dinner-poster.jpg",
  imageAlt:
    "Save the date: OCA Annual Dinner, 18th December, Qutub Golf Course. A poster with the OCA crest and an illustration of the St. Columba’s School building.",
  date: "18 December",
  dateDetail: "Friday, 2026",
  venue: "Qutub Golf Course",
  venueDetail: "New Delhi",
  priceFact: "₹2,500",
  priceDetail: "Passes from — limited numbers",
  passesEyebrow: "Passes",
  passesTitle: "Choose your pass",
  passesIntro: "Passes are limited — the numbers show how many are left. Once the Early Bird passes are gone, Regular passes open.",
};

export const GOLF_DEFAULTS: EventGolfContent = {
  eyebrow: "Save the date",
  title: "OCA Golf Tournament",
  lead: "Tee off from 11:30 am on 18 December, then stay for the OCA Annual Dinner. One pass covers both.",
  image: "/images/golf-tournament-poster.jpg",
  imageAlt:
    "Save the date: OCA Annual Golf Tournament, 18th December 2026, 11 AM onwards, Qutub Golf Course. A poster with the Old Columbans Association crest, a line drawing of the St. Columba’s School building, and a golf green at sunset with a flag, a ball and the Qutub Minar in the distance.",
  date: "18 December",
  dateDetail: "Friday, 2026",
  time: "11:30 am",
  timeDetail: "Onwards",
  priceFact: "₹10,000",
  priceDetail: "Single · Couple ₹12,500",
  passesEyebrow: "Pass",
  passesTitle: "Choose your pass",
  passesIntro: "One pass, two options. Every pass includes complimentary entry to the OCA Annual Dinner.",
};

export const LUNCH_DEFAULTS: EventLunchContent = {
  eyebrow: "OCA Flagship Event",
  title: "Annual Lunch Get Together",
  lead: "The Association’s flagship gathering — Columbans of every batch, back together for an afternoon of food, stories and fellowship.",
  image: U + "2025/12/annual-lunch.jpg",
  imageAlt: "OCA Annual Lunch Get Together",
  date: "14 December",
  dateDetail: "Sunday, 2025",
  time: "12 Noon",
  timeDetail: "Onwards",
  venue: "St. Columba’s",
  venueDetail: "School Grounds, Ashoka Place, New Delhi – 110 001",
};

export const SPORTS_DEFAULTS: EventSportsContent = {
  eyebrow: "OCA Sports",
  title: "Brother Foley Memorial Cricket Tournament",
  lead: "An interschool cricket tournament presented by the Old Columbans Association in memory of Brother Foley — played on the School grounds, in the Columban spirit.",
  image: U + "2022/10/Bro-Foley-Cricket-2022.jpg",
  imageAlt:
    "Poster: Old Columbans Association presents the Bro. Foley Memorial Cricket Tournament, 5 to 12 November 2022, St. Columba's School Grounds",
  posterChip: "2022 EDITION",
  date: "5–12 November",
  dateDetail: "2022 Edition",
  venue: "St. Columba’s",
  venueDetail: "School Grounds, Ashoka Place, New Delhi",
  sponsorEyebrow: "Support the Game",
  sponsorTitle: "Brother Oman Memorial Interschool Cricket Tournament",
  sponsorAmount: "₹1.50 Lacs",
  sponsorImage: U + "2022/11/sponsor-new.jpg",
  sponsorImageAlt: "The Principal's sponsorship appeal for the Brother Oman Memorial Interschool Cricket Tournament",
};

export const MEMBERSHIP_FEE_DEFAULTS: MembershipFeeContent = {
  fee: 2000,
};

export const EMAIL_SETTINGS_DEFAULTS: EmailSettingsContent = {
  registrationCc: "ocacentre@gmail.com",
};

export const CONTACT_DEFAULTS: ContactDetailsContent = {
  name: "The OCA Secretariat",
  email: "info@oldcolumban.net",
  phone: "011-23748666",
  address: "St. Columba’s School, Ashoka Place, New Delhi – 110 001",
  facebook: "",
  x: "",
  instagram: "",
  youtube: "",
  linkedin: "",
};

/** Each section key's defaults, as stored data. */
export const SECTION_DEFAULTS: Record<SiteSectionKey, object> = {
  [SITE_SECTION_KEYS.homeTicker]: HOME_DEFAULTS.ticker,
  [SITE_SECTION_KEYS.homeEvents]: HOME_DEFAULTS.events,
  [SITE_SECTION_KEYS.homeNotices]: HOME_DEFAULTS.notices,
  [SITE_SECTION_KEYS.homeSpotlight]: HOME_DEFAULTS.spotlight,
  [SITE_SECTION_KEYS.homeHangout]: HOME_DEFAULTS.hangout,
  [SITE_SECTION_KEYS.homeSocial]: HOME_DEFAULTS.social,
  [SITE_SECTION_KEYS.homeGallery]: HOME_DEFAULTS.gallery,
  [SITE_SECTION_KEYS.aboutCommittee]: HOME_DEFAULTS.committee,
  [SITE_SECTION_KEYS.eventsDinner]: DINNER_DEFAULTS,
  [SITE_SECTION_KEYS.eventsGolf]: GOLF_DEFAULTS,
  [SITE_SECTION_KEYS.eventsLunch]: LUNCH_DEFAULTS,
  [SITE_SECTION_KEYS.eventsSports]: SPORTS_DEFAULTS,
  [SITE_SECTION_KEYS.membershipFee]: MEMBERSHIP_FEE_DEFAULTS,
  [SITE_SECTION_KEYS.settingsEmails]: EMAIL_SETTINGS_DEFAULTS,
  [SITE_SECTION_KEYS.settingsContact]: CONTACT_DEFAULTS,
};
