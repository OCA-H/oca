import type {
  AnthemContent,
  BatchCoordinatorsContent,
  BatchmatesContent,
  BylawsContent,
  ComingSoonContent,
  InternshipsContent,
  MagazineContent,
  NewslettersContent,
  NewsMakersContent,
  PageContentMap,
  PhotographsContent,
  PrincipalContent,
  RemembranceContent,
  SchoolHistoryContent,
  SocialConsciencePageContent,
  TeachersFundContent,
} from "../schema/pageSections";

// What each About, Gallery, Directory and OCA Connect page shows until an admin saves it: the
// content of the website template (templates/oca-website_V1.html).

const U = "https://www.oldcolumban.net/wp-content/uploads/";
const GATHERING = U + "2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg";
// Kept on this site: the old site no longer serves these two.
const SECRETARIAT = "/images/IMG_1792.jpg";
const DONATE = "/images/hp2-donate-image.jpg";
const LUNCH = "/images/annual-lunch.jpg";

const JOIN_CTA = {
  ctaEyebrow: "Join us",
  ctaTitle: "Once a Columban, always a Columban",
  ctaText: "Lifetime membership keeps you on the roll, in the directory, and in touch with the School.",
};

// ----- About -----

export const BATCH_COORDINATORS_DEFAULTS: BatchCoordinatorsContent = {
  eyebrow: "About OCA",
  title: "Batch Coordinators",
  lead: "We are looking for passionate, well-networked Columbans to act as “Batch Coordinators” for unrepresented Batches.",
  image: GATHERING,
  imageAlt: "Columbans gathered at an Association event",
  imageCaption: "Every batch deserves a voice",
  boardEyebrow: "Get on board",
  boardTitle: "Is your batch unrepresented?",
  boardLead: "We are looking for passionate, well-networked Columbans to act as “Batch Coordinators” for unrepresented Batches.",
  traits: [{ label: "Passionate" }, { label: "Well-networked" }, { label: "A Columban" }],
  cardBadge: "Get in touch",
  contactName: "Mr Amit Bansal",
  contactPhone: "+91 96506 66600",
  cardNote: "to get on board",
};

export const SOCIAL_CONSCIENCE_DEFAULTS: SocialConsciencePageContent = {
  eyebrow: "Giving back",
  title: "OCA Social Conscience",
  lead: "Our prime objective is assisting the School with funds, amenities and inputs from the alumni.",
  image: DONATE,
  imageAlt: "OCA Social Conscience",
  imageCaption: "Your help is very important",
  causesEyebrow: "Our causes",
  causesTitle: "OCA Social Conscience",
  ctaEyebrow: "Your help is very important",
  ctaTitle: "Give back to the School",
  ctaText: "Every contribution helps the School and the people who make it what it is.",
};

export const TEACHERS_FUND_DEFAULTS: TeachersFundContent = {
  eyebrow: "OCA Social Conscience",
  title: "Teachers Benevolent Fund",
  lead: "As we all are aware, this fund was initiated in earnest by the Old Columbans Association, after the unfortunate incident involving an ex-teacher of SCS, who was promptly and adequately rehabilitated, and with many past students of SCS volunteering to donate money to help our other similar educators in distress.",
  fund: "tbf",
  committeeEyebrow: "Governance",
  committeeTitle: "The Executive Committee of the OCA unanimously approved the formation of the Managing Committee which will be responsible for running this fund.",
  committeeIntro: "It is an honour to introduce to you the Founding Managing Committee Members of the OCA Teachers Benevolent Fund with the following distinguished members :",
  members: [
    { name: "Bro E. V. Miranda", role: "Ex-Principal, SCS (2016–2022)", term: "Term: 5 years", termKind: "fixed" },
    { name: "Mrs. Anita Ghai", role: "Ex-Teacher, with SCS for over 30 years", term: "Term: 5 years", termKind: "fixed" },
    { name: "Mr. Arun Khanna", role: "Immediate Past President – OCA", term: "Term: term of this EC", termKind: "ec" },
    { name: "Mr. Parvinder Singh Kohli", role: "President – OCA", term: "Term: term of this EC", termKind: "ec" },
    { name: "Mr. Deep Kalra", role: "Member EC, OCA", term: "Term: term of this EC", termKind: "ec" },
  ],
  termNote: "The terms of (a) and (b) as above, to be fixed for 5 years and the other to be replaced by the following ECs in the same order.",
  rulesEyebrow: "The Rules",
  rulesTitle: "Rules of running of the Fund as deliberated and decided by the EC:",
  rules: [
    { title: "Eligibility of Beneficiary from the fund", text: "Only teachers, serving and/or retired, with no min years of service." },
    { title: "Approval", text: "No money shall be released without the explicit approval from the Managing Committee heading the fund." },
    { title: "Assessing need", text: "Committee is empowered to deliberate and take the call of the “need” of the beneficiary based on funds available." },
    { title: "No monthly pension", text: "No money would be given as a monthly pension." },
    { title: "No target size", text: "There shall be no target size of the fund. The aim would be to raise as much money as possible so that in time of need adequate funds are available." },
  ],
  ctaEyebrow: "Give to the Fund",
  ctaTitle: "Stand with our teachers",
  ctaText: "The teachers who shaped us deserve support in their time of need. Every contribution adds to a fund that is there when a teacher needs it.",
};

export const BYLAWS_DEFAULTS: BylawsContent = {
  eyebrow: "About OCA",
  title: "ByLaws",
  lead: "The Memorandum of Constitution and the Rules and Regulations of the Old Columbans Association, in full.",
  image: GATHERING,
  imageAlt: "Columbans gathered at an Association event",
  imageCaption: "The rules that guide the Association",
  pdf: U + "2022/10/OCA_byLaw.pdf",
  downloadLabel: "Download the ByLaws",
  downloadNote: "Tap to get the PDF",
  pages: [],
};

// ----- Gallery -----

export const ANTHEM_DEFAULTS: AnthemContent = {
  eyebrow: "School Anthem",
  title: "Our School Anthem",
  lead: "The song Columbans carry with them long after they leave the School. Watch it, read the words, and keep the audio close.",
  video: "https://www.youtube.com/watch?v=nbY0dD3Q9nE",
  downloadsEyebrow: "Keep It With You",
  downloadsTitle: "Download School Anthem Song",
  downloads: [
    { label: "Download Song 1", note: "School Anthem · Audio · MP3", file: U + "2016/01/01-Track-1.wma" },
    { label: "Download Song 2", note: "School Anthem · Audio · MP3", file: U + "2016/01/03-Track-3.wma" },
  ],
  lyricsEyebrow: "The Words",
  lyricsTitle: "Our School Anthem",
  lyrics: [
    "We sing praises of you St. Columba",
    "Scholars of Columba’s we",
    "Dare to be wise always",
    "Sincere and constant we.",
    "This is our motto that guides us",
    "Through life eternally",
    "This truth we learn in our days of youth",
    "Gives us strength in fraternity.",
    "",
    "With glory glows the spirit of S.C.S.",
    "Marking all our efforts with true success",
    "And our Alma Matter seals us as a chosen band",
    "We all work together",
    "for the glory of our land.",
    "",
    "We sing praises of you St. Columba",
    "Scholars of Columba’s we",
    "Dare to be wise always",
    "Sincere and constant we.",
    "This is our motto that guides us",
    "Through life eternally",
    "This truth we learn in our days of youth",
    "Gives us strength in fraternity.",
    "",
    "Pride in carrying our banners of green and gold",
    "Banners that will lead us towards all our goals",
    "Service to others and our nations good",
    "We all come together in godly brotherhood.",
  ].join("\n"),
  ctaEyebrow: "Stay Connected",
  ctaTitle: "Be part of the Columban family",
  ctaText: "Become a member of the Old Columbans Association and stay part of the community the anthem belongs to.",
};

export const SCHOOL_HISTORY_DEFAULTS: SchoolHistoryContent = {
  eyebrow: "About the School",
  title: "St. Columba’s School, New Delhi",
  lead: "A highly acclaimed Christian Brothers institution — founded in 1941 with 32 boys, and today among the premier schools of India.",
  image: SECRETARIAT,
  imageAlt: "St. Columba’s School, Ashoka Place, New Delhi",
  imageCaption: "",
  schoolUrl: "",
  stats: [
    { value: "1941", suffix: "", label: "Year of founding" },
    { value: "32", suffix: "", label: "Students on the first day" },
    { value: "3000", suffix: "+", label: "Students enrolled today" },
    { value: "1991", suffix: "", label: "Move to the CBSE curriculum" },
  ],
  introEyebrow: "Our School",
  introTitle: "A Christian Brothers school with a long list of distinguished alumni",
  introBody:
    "**St. Columba’s School** is one of the premier educational institutions of India, run by the Christian Brothers. It is known for its leadership in education and for a long list of distinguished alumni — the Columbans whom this Association exists to bring together.\n\nFounded in 1941 with just 32 students, the School now has over 3,000 on its rolls, with many more names waiting for admission. It is guided by its motto.",
  introImage: LUNCH,
  introImageAlt: "Columbans of every batch at the OCA Annual Lunch",
  introCaption: "Columbans of every batch, gathered in fellowship.",
  mottoLatin1: "Sapere aude",
  mottoLatin2: "sincere et constanter",
  mottoTranslation: "Dare to be wise, sincere and constant.",
  mottoCaption: "The motto of St. Columba’s School",
  timelineEyebrow: "Our History",
  timelineTitle: "From a few temporary structures to Ashoka Place",
  timelineIntro: "The key moments in the growth of the School.",
  timeline: [
    { date: "1940", title: "The land is granted", text: "The Christian Brothers receive land from Archbishop Sylvester Patrick Mulligan, on which the School would be built.", major: "no" },
    { date: "7 January 1941", title: "Classes begin", text: "The first classes are held in temporary structures, with just 32 students.", major: "no" },
    { date: "29 April 1941", title: "Formal opening", text: "The School is formally opened under its first Principal, Brother R.E. Butler.", major: "yes" },
    { date: "July 1941", title: "Cambridge affiliation", text: "The School obtains affiliation to the University of Cambridge.", major: "no" },
    { date: "1956", title: "The Junior School block", text: "Additional land is acquired, and the Junior School block is built.", major: "no" },
    { date: "1965 – 66", title: "Land for the Middle School", text: "A further acquisition provides the land for the Middle School.", major: "no" },
    { date: "1991", title: "The CBSE curriculum", text: "The School moves from the Cambridge curriculum to CBSE.", major: "yes" },
  ],
  academicsEyebrow: "Academics & Character",
  academicsTitle: "A vigorous academic environment",
  academicsBody:
    "The School regularly produces merit-ranked IITians and toppers. This success rests on a vigorous academic environment and a faculty committed to the individual development of every student.",
  academicsImage: U + "2022/10/Bro-Foley-Cricket-2022.jpg",
  academicsImageAlt: "Sport at St. Columba’s School",
  academicsCaption: "Academic rigour and sport, side by side.",
  pillars: [
    { title: "Academic excellence", text: "a rigorous environment that brings out the best in each boy." },
    { title: "Individual attention", text: "teachers committed to developing students as individuals." },
    { title: "Leadership", text: "a School recognised for its leadership in education." },
  ],
  quoteEyebrow: "A Social Conscience",
  quote: "To awaken a social conscience within its students.",
  quoteAfter:
    "The School makes its students aware of the inequalities in society, and encourages young people to take part in bringing about social change — a spirit the Old Columbans carry forward through the Association’s own Social Conscience initiatives.",
  recognitionEyebrow: "Recognition",
  recognitionTitle: "Honoured for the quality of its education",
  recognitions: [
    { title: "The Whole School Award", text: "Conferred by the Education Quality Foundation of India for the dissemination of quality education." },
    { title: "Ranked among India’s top boys’ schools", text: "Consistently ranked among the top boys’ schools in the country by Education World." },
  ],
  ...JOIN_CTA,
};

export const PRINCIPAL_DEFAULTS: PrincipalContent = {
  eyebrow: "About Our Principal",
  title: "Br. Robert Fernandes",
  lead: "Br. Robert Fernandes was born in Goa and was initially brought up in the Middle East due to his father’s job in Qatar.",
  image: "/images/principal-robert-fernandes.png",
  imageAlt: "Br. Robert Fernandes, Principal of St. Columba’s School",
  storyEyebrow: "About Our Principal",
  storyTitle: "About Our Principal – Br. Robert Fernandes",
  blocks: [
    {
      heading: "Early years",
      body: "Br. Robert Fernandes was born in Goa and was initially brought up in the Middle East due to his father’s job in Qatar.\n\nAfter completing his initial studies till Class 3 while with his parents in Qatar, he joined his two elder brothers in St. Mary’s High School, Mt Abu (run by the Christian Brothers), where he studied from 1990 to 1996. After the completion of the ICSE in 1997, he joined St. Xavier’s College in Goa and completed the Class 12 Board Examination in Science in 1999.",
    },
    {
      heading: "Becoming a Christian Brother",
      body: "Intending to be a Christian Brother, he joined the Postulancy Formation Programme in Asansol on 1st June 1999, which in a way was special considering that 1st June is the birthday of our Founder Edmund Rice.\n\nHe then joined the Novitiate of the Christian Brothers (in 2000) and was professed as a Christian Brother in 2001. He made his life commitment as a Christian Brother in 2010.",
    },
    {
      heading: "Education",
      body: "Br. Robert graduated with a B.Sc. Zoology (Hons) from St. Edmund’s College, (Shillong) and over the years that followed, he completed a M.Sc. in Zoology and the professional teaching degree (B.Ed.).",
    },
    {
      heading: "Ministry and leadership",
      body: "As a Christian Brother, Br. Robert has ministered in St. George’s Free School, Bow Bazar, Kolkata (2002), St. Columba’s School, New Delhi (2006), St. Mary’s High School, Mt. Abu (2007 to 2011) and St. Mary’s Orphanage and Day School, Dum Dum, Kolkata (2013).\n\nBr. Robert served as Principal in Ane Moriam School, Sangram, Arunachal Pradesh (2014 to 2016), Goethals Memorial School, Kurseong (2016 to 2018) and St. Mary’s High School, Mt. Abu (2018 to 2021).",
    },
  ],
  timelineBadge: "Journey at a glance",
  timeline: [
    { year: "1990–96", event: "Studied at St. Mary’s High School, Mt Abu" },
    { year: "1999", event: "Postulancy Formation Programme, Asansol — 1st June" },
    { year: "2000", event: "Joined the Novitiate of the Christian Brothers" },
    { year: "2001", event: "Professed as a Christian Brother" },
    { year: "2002", event: "St. George’s Free School, Bow Bazar, Kolkata" },
    { year: "2006", event: "St. Columba’s School, New Delhi" },
    { year: "2007–11", event: "St. Mary’s High School, Mt. Abu" },
    { year: "2010", event: "Made his life commitment as a Christian Brother" },
    { year: "2013", event: "St. Mary’s Orphanage and Day School, Dum Dum, Kolkata" },
    { year: "2014–16", event: "Principal — Ane Moriam School, Sangram, Arunachal Pradesh" },
    { year: "2016–18", event: "Principal — Goethals Memorial School, Kurseong" },
    { year: "2018–21", event: "Principal — St. Mary’s High School, Mt. Abu" },
  ],
  ctaEyebrow: "Patron of the Association",
  ctaTitle: "Meet the Executive Committee",
  ctaText: "Br. Robert Fernandes is the Patron of the Old Columbans Association.",
};

const magazine = (year: string, image: string, href = `https://www.oldcolumban.net/school-magazine-${year}/`) => ({ year, image: U + image, href });

export const MAGAZINE_DEFAULTS: MagazineContent = {
  eyebrow: "The Archive",
  title: "The Columban — School Magazine",
  lead: "Six decades of St. Columba’s School, in the School’s own words. Browse every edition in the archive, from 1962 to today.",
  image: U + "2022/10/1973-columban-1.jpg",
  imageAlt: "The Columban, 1973 edition",
  featuredEyebrow: "Featured",
  featuredTitle: "Two editions to start with",
  featuredIntro: "One from the golden years of the 1970s, and the most recent edition in the archive.",
  featured: [
    {
      kicker: "From the archive",
      year: "1973",
      desc: "An edition from the 1970s — school life, sport and the voices of a generation of Columbans.",
      image: U + "2022/10/1973-columban-1.jpg",
      href: "https://www.oldcolumban.net/school-magazine-1973/",
    },
    {
      kicker: "Latest edition",
      year: "2018-19",
      desc: "The most recent edition in the archive, from the 2018–19 school year.",
      image: U + "2022/10/2019-columban.jpg",
      href: "https://www.oldcolumban.net/school-magazine/school-magazine-2018-19",
    },
  ],
  archiveEyebrow: "Full Archive",
  archiveTitle: "Every edition, by decade",
  editions: [
    ...["1962", "1963", "1964", "1965", "1966", "1967", "1968", "1970", "1971", "1972"].map((year) => magazine(year, `2022/12/columban-${year}.jpg`)),
    magazine("1973", "2022/10/1973-columban-1.jpg"),
    ...["1981-82", "1982-83", "1983-84", "1984-85", "1985-86", "1986-87", "1987-88", "1988-89", "1989-90"].map((year) => magazine(year, `2022/12/columban-${year}.jpg`)),
    magazine("1992", "2022/12/columban-1992.jpg"),
    ...["2001-02", "2002-03", "2003-04", "2004-05", "2005-06", "2006-07", "2007-08", "2008-09", "2009-10"].map((year) => magazine(year, `2022/12/columban-${year}.jpg`)),
    magazine("2018-19", "2022/10/2019-columban.jpg", "https://www.oldcolumban.net/school-magazine/school-magazine-2018-19"),
  ],
  membersNote: "**Members can view these magazines.** Some editions open only for signed-in Old Columbans.",
  ...JOIN_CTA,
};

export const PHOTOGRAPHS_DEFAULTS: PhotographsContent = {
  eyebrow: "Gallery",
  title: "Event Photographs",
  lead: "Moments from the Annual Lunch, the sports field and the life of the Association — Columbans of every batch, together.",
  image: LUNCH,
  imageAlt: "Columbans of every batch at the OCA Annual Lunch",
  imageCaption: "",
  soonTitle: "More albums coming soon",
  soonText: "We are adding photographs from more events. Have pictures from an OCA gathering to share? Write to the Secretariat.",
  ctaEyebrow: "Join us",
  ctaTitle: "Be in the next photograph",
  ctaText: "Join the Association and come to the next gathering.",
};

// ----- Directory -----

export const BATCHMATES_DEFAULTS: BatchmatesContent = {
  eyebrow: "Directory",
  title: "Find Your Batchmates",
  lead: "Every Columban on the roll, searchable by batch, by city and by name. Sign in to see the directory and to keep your own entry current.",
  image: GATHERING,
  imageAlt: "Columbans at an Association gathering",
  imageCaption: "Your batch is closer than you think",
  howEyebrow: "How it works",
  howTitle: "Three steps to your batch",
  howIntro: "The directory is open to members of the Association. It is built from what members tell us, so the more of us who keep our entries current, the more useful it is to everyone.",
  steps: [
    { title: "Sign in", text: "Use the member login you created when you joined. If you have not set one up, create an account and we will match it to your membership record." },
    { title: "Search by batch, city or name", text: "Pick your year of leaving to see everyone from your batch, or search across batches for Columbans in the city you have moved to." },
    { title: "Update your own entry", text: "Add your current city, profession and contact details. You choose what other members can see." },
  ],
  searchEyebrow: "Search",
  searchTitle: "Look up a Columban",
  searchText: "Start with just a name or a batch year. Add a city or profession only if you need to narrow things down — most searches do not need either.",
  visibilityEyebrow: "Your entry",
  visibilityTitle: "What other members can see",
  visibilityIntro: "You decide what shows on your entry. Batch and city are shown by default; the rest stay hidden until you turn them on.",
  shownTags: "Batch, City",
  hiddenTags: "Profession, Email, Phone",
  ctaEyebrow: "Keep it current",
  ctaTitle: "An out-of-date entry helps no one",
  ctaText: "Five minutes of your time makes you findable to every batchmate who looks.",
};

export const CHAPTERS_DEFAULTS: ComingSoonContent = {
  eyebrow: "Directory",
  title: "Worldwide Chapters & Office Bearers",
  lead: "A living map of where Columbans have settled, and who leads each chapter. We are putting it together now.",
  image: LUNCH,
  imageAlt: "Columbans gathered at the Annual Get Together",
  imageCaption: "Wherever there are Columbans",
  soonTitle: "This directory is coming soon",
  soonText: "We are mapping OCA chapters and their office bearers city by city, so Columbans abroad can find each other at a glance. If you already convene a chapter, or want to start one where you live, let the Secretariat know and we will include you when this goes live.",
};

// ----- OCA Connect -----

export const NEWS_MAKERS_DEFAULTS: NewsMakersContent = {
  eyebrow: "OCA Connect",
  title: "News Makers",
  lead: "Columbans who have made their mark — in law, in diplomacy, in journalism and in the classroom. Their achievements are the School’s best argument for itself.",
  image: SECRETARIAT,
  imageAlt: "Columbans at the Secretariat",
  imageCaption: "Columbans at the OCA Secretariat",
  profilesEyebrow: "Honours",
  profilesTitle: "Columbans in the news",
  profilesIntro: "A few of the old boys whose work has carried the School’s name further than any of us could alone. Each photograph enlarges if you click it.",
  profiles: [
    {
      image: U + "2022/10/Chadrachud-Congrats-web.jpg",
      imageAlt: "Justice D. Y. Chandrachud",
      chip: "Judiciary",
      name: "Justice D. Y. Chandrachud",
      batch: "",
      bio: "Former Chief Justice of India, and one of the most widely cited judges of his generation. The Association shared this message with every Columban when his appointment was announced.",
      linkLabel: "",
      linkHref: "",
    },
    {
      image: U + "2021/09/ranjit-rae.jpg",
      imageAlt: "Ranjit Rae",
      chip: "Diplomacy",
      name: "Ranjit Rae",
      batch: "Batch of 1972",
      bio: "Thirty-six years in the Indian Foreign Service, after two years lecturing in Economics at St Stephen’s College. Rae served as India’s Ambassador to Hungary, Vietnam and Nepal, worked on UN peacekeeping in Kosovo, and was Press Secretary to the President of India. After retiring he joined the Commonwealth High-Level Group on Governance and now advises the UN’s Peace Division. His book, *Kathmandu Dilemma: Resetting India–Nepal Ties*, was published by Penguin Random House in 2021.",
      linkLabel: "",
      linkHref: "",
    },
    {
      image: U + "2021/09/SANDEEP-BAMZAI.jpeg",
      imageAlt: "Sandeep Bamzai",
      chip: "Journalism",
      name: "Sandeep Bamzai",
      batch: "Batch of 1981",
      bio: "Over forty years in Indian journalism, from cricket writer at *The Statesman* to National Business Editor of Hindustan Times, Executive Editor at TV Today, and Editor-in-Chief of the newswire IANS. He has written four books, including the award-winning *Princestan: How Nehru, Patel and Mountbatten Made India*.",
      linkLabel: "",
      linkHref: "",
    },
    {
      image: U + "2021/09/Arjit-Singh-Arora.jpg",
      imageAlt: "Arjit Singh Arora",
      chip: "Academics",
      name: "Arjit Singh Arora",
      batch: "Batch of 2021",
      bio: "School topper of the Class of 2021, with a 99 percentile aggregate in Science on the Board Examinations. Arjit is headed for a career in engineering, and was an active participant in interschool competitions and national Olympiads during his time at the School.",
      linkLabel: "",
      linkHref: "",
    },
    {
      image: U + "2023/04/Justin-Singh-Article-Final-March-04-2023-1.jpg",
      imageAlt: "Justin Singh",
      chip: "Featured",
      name: "Justin Singh",
      batch: "",
      bio: "Profiled in the Association’s series on Columbans of success. The full feature is reproduced as published.",
      linkLabel: "Open the full feature →",
      linkHref: U + "2023/04/Justin-Singh-Article-Final-March-04-2023-1.jpg",
    },
  ],
  ctaEyebrow: "Stay in touch",
  ctaTitle: "The next name on this page is a Columban you know",
  ctaText: "Join the Association and you will hear about them first.",
};

export const ALUMNI_SERVICES_DEFAULTS: ComingSoonContent = {
  eyebrow: "OCA Connect",
  title: "Alumni Services",
  lead: "A single place for everything membership unlocks — mentoring, member offers, and services run by Columbans for Columbans. We are building it now.",
  image: GATHERING,
  imageAlt: "Columbans at an Association event",
  imageCaption: "For Columbans, by Columbans",
  soonTitle: "This page is coming soon",
  soonText: "We are bringing the Association’s member services together in one place. Until then, the directory, events and newsletters are already open to every member.",
};

export const CAREERS_DEFAULTS: ComingSoonContent = {
  eyebrow: "OCA Connect",
  title: "Careers",
  lead: "A place for Columbans to hire Columbans. We are building it now.",
  image: SECRETARIAT,
  imageAlt: "Columbans at the Secretariat",
  imageCaption: "A word from an old boy still counts",
  soonTitle: "A careers board is on its way",
  soonText: "A simple way for members to post roles and be found by other Columbans is being built. Until then, write to the Secretariat with a role you are hiring for, or keep your directory entry current so members looking to hire can find you.",
};

export const NETWORKING_DEFAULTS: ComingSoonContent = {
  eyebrow: "OCA Connect",
  title: "Networking",
  lead: "Introductions between Columbans, made easy. We are building it now.",
  image: GATHERING,
  imageAlt: "Columbans at an Association gathering",
  imageCaption: "One school, one brotherhood",
  soonTitle: "A simple way to ask is on its way",
  soonText: "We are building a straightforward way to request an introduction to another Columban. Until then, the Secretariat is glad to make introductions by hand — tell us who you are looking for and why.",
};

export const INTERNSHIPS_DEFAULTS: InternshipsContent = {
  eyebrow: "OCA Connect",
  title: "OCA Internships Program",
  lead: "Short placements with Columban-run firms, for boys still at the School and for old boys at the start of their careers. The quickest way an old boy can repay the School is to give a young one a first month of real work.",
  image: SECRETARIAT,
  imageAlt: "At the OCA Secretariat",
  imageCaption: "A first month of real work",
  facts: [
    { value: "4–8 weeks", label: "Length of a placement, usually over the summer break" },
    { value: "Class 11+", label: "Open to senior boys, and Columbans in their first two years out" },
    { value: "Free", label: "Nothing is charged to a student or to a host firm" },
  ],
  hostEyebrow: "For host firms",
  hostTitle: "What we ask of you",
  hostIntro: "A placement does not need a programme or a budget. It needs a desk, a real task and somebody to answer questions.",
  hostSteps: [
    { title: "One piece of real work", text: "Something that would have been done anyway, not an exercise invented for a visitor." },
    { title: "One person to ask", text: "A colleague who will take ten minutes a day. That is the whole supervision requirement." },
    { title: "A note at the end", text: "Three lines on how they did, which we pass to the student and keep on file." },
  ],
  applyEyebrow: "For applicants",
  applyTitle: "How to apply",
  applyText: "Write to the Secretariat before the end of the Spring term with your name, batch, what you are studying and the two fields that interest you most. We match applicants to the placements offered that year, and we tell everyone either way.",
  ctaEyebrow: "Offer one",
  ctaTitle: "A month of your firm’s time changes a year of someone’s life",
  ctaText: "If your organisation can take one Columban this summer, tell us now so we can match them.",
};

export const NEWSLETTERS_DEFAULTS: NewslettersContent = {
  eyebrow: "OCA Connect",
  title: "Newsletters & Notices",
  lead: "Everything the Association sends its members: AGM notices, minutes, balance sheets and the newsletter archive. Nothing here is behind a login.",
  image: DONATE,
  imageAlt: "The Association at work",
  imageCaption: "Written to every Columban",
  noticesEyebrow: "The archive",
  noticesTitle: "Latest notices",
  noticesIntro: "Newest first. These open on the Association’s document archive.",
  archiveEyebrow: "Newsletter archive",
  archiveTitle: "Every issue on file",
  archiveIntro: "Scanned and kept exactly as printed.",
  issues: [
    { date: "September 2018", title: "Volume 2018 – Issue 2", image: U + "2016/03/OCA-Newsletter-Sep-2018-1024x567.jpg", file: U + "2018/09/OCA_Newsletter-Volume2-2018.pdf" },
    { date: "January 2018", title: "Volume 2018 – Issue 1", image: U + "2016/03/OCA-Newsletter-Jan-2018-1024x542.jpg", file: U + "2016/03/OCA-Newsletter-Jan-2018.pdf" },
    { date: "2016", title: "Volume 1", image: U + "2018/02/OCA_Newsletter-Volume1-new-1024x533.jpg", file: U + "2016/03/OCA_Newsletter-Volume1.pdf" },
  ],
  olderNote: "**Looking for something older?** Notices and minutes from earlier years are held at the Secretariat and are available to members on request.",
  emailEyebrow: "By email",
  emailTitle: "Have them sent to you",
  emailIntro: "Members receive every notice by email as it is issued. If yours have stopped arriving, your address on the roll is probably out of date.",
  ctaEyebrow: "Stay informed",
  ctaTitle: "The AGM is where the Association is decided",
  ctaText: "Members get the notice, the agenda and the balance sheet before every meeting.",
};

export const REMEMBRANCE_DEFAULTS: RemembranceContent = {
  eyebrow: "OCA Connect",
  title: "Remembrance",
  lead: "For the Columbans and the masters we have lost. The School gave us the same start, and the Association keeps their names where the rest of us can find them.",
  image: DONATE,
  imageAlt: "In memory",
  imageCaption: "Remembered by the Columban family",
  rollEyebrow: "In memoriam",
  rollTitle: "The roll of remembrance",
  rollIntro: "The Association keeps this roll from what families and batchmates send in. It is read at the Annual General Meeting each year.",
  entries: [
    {
      image: U + "2024/10/dasu.jpg",
      imageAlt: "Bro. Eric D’Souza",
      name: "Bro. Eric D’Souza",
      meta: "Teacher and Headmaster",
      quote: "“You didn’t just teach us lessons, you taught us to believe in the power of our dreams.”",
      text: "To the incredible teacher and head master who saw our potential and nurtured our passions — thank you for shaping our futures with your wisdom and care. We are forever grateful for your guidance and inspiration.",
    },
    {
      image: U + "2024/09/oca-robert.jpg",
      imageAlt: "Robert Dias",
      name: "Robert Dias",
      meta: "Passed away 11 September 2024",
      quote: "",
      text: "It is with deep sadness that we share the news of Robert Dias’s passing, leaving behind a legacy of kindness, love and strength that touched so many lives. Robert will be remembered for always being there when needed, and for his intelligence. Our hearts are with all who knew and loved him.",
    },
    {
      image: U + "2024/06/Saurav-Datta.jpg",
      imageAlt: "Saurav Dutta",
      name: "Saurav Dutta",
      meta: "Batch of 1994 · passed away at 48",
      quote: "",
      text: "A proud member of the 1994 batch, Saurav was not just a remarkable singer and guitarist but a truly lovely human being. His music resonated with all who knew him, and his generosity and loyalty were only matched by his talent. He will be deeply missed by everyone who had the privilege of knowing him.",
    },
    {
      image: U + "2023/10/Ramnik-Vohra.jpg",
      imageAlt: "Ramnik Vohra",
      name: "Ramnik Vohra",
      meta: "Batch of 1989 · passed away 23 October 2023",
      quote: "",
      text: "Ramnik (Bobby) passed away in the US on 23rd October, of a cardiac arrest. Our deepest condolences to his immediate family, loved ones and friends, with prayers for his departed soul. He will be missed.",
    },
    {
      image: U + "2023/09/Gurshan-Yashpal-1.jpg",
      imageAlt: "Gurshan Yashpal (Garry)",
      name: "Gurshan Yashpal (Garry)",
      meta: "Batch of 1998 · passed away 21 September 2023",
      quote: "",
      text: "Gurshan passed away in Goa, full of life, love and energy — a true friend and a true fighter. A confident leader who dared to be different, he drew from his rich experiences and held an unshakeable belief in himself and his convictions. We shall all miss you.",
    },
  ],
  howEyebrow: "How we remember",
  howTitle: "Three things the Association does",
  ways: [
    { title: "At the AGM", text: "The names of Columbans and masters lost since the last meeting are read aloud." },
    { title: "To the batch", text: "Batch coordinators are told, so that those who sat beside him hear it from a Columban." },
    { title: "For the family", text: "Where a family is in need, the Executive Committee considers what the Association can do." },
  ],
  quote: "The teachers who gave their working lives to St. Columba’s do not stop being ours when they leave the staff room. The Teachers Benevolent Fund exists so that no master who taught us is left without help.",
  quoteAfter: "The Teachers Benevolent Fund",
};

/** Each page section key's defaults, as stored data. */
export const PAGE_SECTION_DEFAULTS: PageContentMap = {
  "about.batch-coordinators": BATCH_COORDINATORS_DEFAULTS,
  "about.social-conscience": SOCIAL_CONSCIENCE_DEFAULTS,
  "about.teachers-benevolent-fund": TEACHERS_FUND_DEFAULTS,
  "about.bylaws": BYLAWS_DEFAULTS,
  "gallery.school-anthem": ANTHEM_DEFAULTS,
  "gallery.school-history": SCHOOL_HISTORY_DEFAULTS,
  "gallery.our-principal": PRINCIPAL_DEFAULTS,
  "gallery.school-magazine": MAGAZINE_DEFAULTS,
  "gallery.event-photographs": PHOTOGRAPHS_DEFAULTS,
  "directory.find-your-batchmates": BATCHMATES_DEFAULTS,
  "directory.worldwide-chapters": CHAPTERS_DEFAULTS,
  "connect.news-makers": NEWS_MAKERS_DEFAULTS,
  "connect.alumni-services": ALUMNI_SERVICES_DEFAULTS,
  "connect.careers": CAREERS_DEFAULTS,
  "connect.networking": NETWORKING_DEFAULTS,
  "connect.internships": INTERNSHIPS_DEFAULTS,
  "connect.newsletters": NEWSLETTERS_DEFAULTS,
  "connect.remembrance": REMEMBRANCE_DEFAULTS,
};
