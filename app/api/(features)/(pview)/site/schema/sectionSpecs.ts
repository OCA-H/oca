// What each editable section of the site holds, in one place: the server validates saves against
// these specs, and the admin panel builds its forms from them. To make another section editable,
// add its spec here, its defaults in services/siteDefaults.ts, and read it where the page renders.
// No server-only imports: the admin panel (a client component) imports this file too.

export type FieldType = "text" | "textarea" | "image" | "link" | "select" | "number" | "email" | "emails";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Longest text accepted, or the largest number. */
  max?: number;
  /** Smallest number accepted. */
  min?: number;
  /** Numbers only: refuse fractions. */
  integer?: boolean;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Starts a new block of the editor under this heading, for sections with many fields. */
  heading?: string;
}

/** A repeating group inside a section: event cards, notices, posts. */
export interface ListSpec {
  key: string;
  label: string;
  /** "Event", "Notice": what one entry is called in the editor. */
  itemLabel: string;
  /** The field that names an entry in the collapsed list. */
  titleField: string;
  hint?: string;
  min: number;
  max: number;
  fields: FieldSpec[];
}

export interface SectionSpec {
  key: SiteSectionKey;
  /** Which group of the admin menu the section is under. */
  page: "home" | "about" | "events" | "membership" | "settings";
  label: string;
  description: string;
  /** Where the section sits on its page, for "View on site". Settings that are not on a page have none. */
  href?: string;
  fields: FieldSpec[];
  lists: ListSpec[];
}

export const SITE_SECTION_KEYS = {
  homeEvents: "home.events",
  homeNotices: "home.notices",
  homeSpotlight: "home.spotlight",
  homeHangout: "home.hangout",
  homeSocial: "home.social",
  aboutCommittee: "about.committee",
  eventsDinner: "events.dinner",
  eventsLunch: "events.lunch",
  eventsSports: "events.sports",
  membershipFee: "membership.fee",
  settingsEmails: "settings.emails",
  settingsContact: "settings.contact",
} as const;

export type SiteSectionKey = (typeof SITE_SECTION_KEYS)[keyof typeof SITE_SECTION_KEYS];

/** A section's saved content: plain fields, plus one array per list. */
export type SectionValue = string | number;
export type SectionItem = Record<string, SectionValue>;
export type SectionData = Record<string, SectionValue | SectionItem[]>;

// ---------- Home page content, as the sections render it ----------

export interface HomeEventItem {
  image: string;
  imageAlt: string;
  dateChip: string;
  caption: string;
  date: string;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomeEventsContent {
  eyebrow: string;
  title: string;
  intro: string;
  items: HomeEventItem[];
}

export interface HomeNoticeItem {
  image: string;
  imageAlt: string;
  date: string;
  title: string;
  href: string;
}

export interface HomeNoticesContent {
  eyebrow: string;
  title: string;
  intro: string;
  updatedLabel: string;
  items: HomeNoticeItem[];
}

export interface HomeSpotlightContent {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  pill: string;
  headline: string;
  body: string;
  linkLabel: string;
  linkHref: string;
}

export interface HomeHangoutPost {
  type: "photo" | "video";
  image: string;
  imageAlt: string;
  duration: string;
  name: string;
  batch: string;
  caption: string;
  time: string;
}

export interface HomeHangoutContent {
  eyebrow: string;
  title: string;
  intro: string;
  highlight: string;
  posts: HomeHangoutPost[];
}

export interface HomeCause {
  status: "featured" | "muted";
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  desc: string;
  progress: number;
  raised: string;
  goal: string;
  href: string;
  ctaHref: string;
}

export interface HomeSocialContent {
  eyebrow: string;
  title: string;
  intro: string;
  causes: HomeCause[];
}

export interface HomeCommitteeMember {
  image: string;
  imageAlt: string;
  name: string;
  role: string;
  initials: string;
}

export interface HomeCommitteeContent {
  eyebrow: string;
  title: string;
  members: HomeCommitteeMember[];
}

// ---------- Event pages ----------

/** The banner at the top of an event page. */
export interface EventHero {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
}

/** /annual-dinner: banner, key facts and the "Choose your pass" heading. Pass prices are not here. */
export interface EventDinnerContent extends EventHero {
  date: string;
  dateDetail: string;
  venue: string;
  venueDetail: string;
  priceFact: string;
  priceDetail: string;
  passesEyebrow: string;
  passesTitle: string;
  passesIntro: string;
}

/** /annual-lunch: banner and key facts. */
export interface EventLunchContent extends EventHero {
  date: string;
  dateDetail: string;
  time: string;
  timeDetail: string;
  venue: string;
  venueDetail: string;
}

/** /sports: the tournament banner and key facts, and the sponsorship appeal further down. */
export interface EventSportsContent extends EventHero {
  posterChip: string;
  date: string;
  dateDetail: string;
  venue: string;
  venueDetail: string;
  sponsorEyebrow: string;
  sponsorTitle: string;
  sponsorAmount: string;
  sponsorImage: string;
  sponsorImageAlt: string;
}

// ---------- Membership ----------

export interface MembershipFeeContent {
  /** The one-time Life Membership fee in whole rupees: what the form shows and CCAvenue charges. */
  fee: number;
}

// ---------- Settings, read by the server only ----------

export interface EmailSettingsContent {
  /** Comma-separated addresses copied on every email the website sends, except password resets. */
  registrationCc: string;
}

/** How members reach the Association: shown in the footer, on the pages, and in every email. */
export interface ContactDetailsContent {
  /** "The OCA Secretariat": who the email and phone reach, and who signs the emails. */
  name: string;
  email: string;
  /** As it is shown, e.g. "011-23748666"; the call link is made from its digits. */
  phone: string;
  address: string;
  /** Social profiles for the footer; an empty one hides its icon. */
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

/** "011-23748666" → "tel:01123748666": the digits, and a leading + if there is one. */
export const phoneHref = (phone: string): string => `tel:${phone.trim().startsWith("+") ? "+" : ""}${phone.replace(/\D/g, "")}`;

/** Everything the home page reads from the database. */
export interface HomeContent {
  events: HomeEventsContent;
  notices: HomeNoticesContent;
  spotlight: HomeSpotlightContent;
  hangout: HomeHangoutContent;
  social: HomeSocialContent;
  committee: HomeCommitteeContent;
}

// ---------- Specs ----------

const IMAGE_HINT = "Upload a JPG, PNG or WebP, or paste an image address.";
const ALT_HINT = "Describes the image for screen readers and search engines.";
const LINK_HINT = "A page on this site (/annual-dinner) or a full address (https://…).";
const SOCIAL_HINT = "The full address of the page (https://…). Leave empty to hide its icon in the footer.";

/** Eyebrow, heading and intro: every section opens with them. */
const sectionHead = (introMax = 400): FieldSpec[] => [
  { key: "eyebrow", label: "Eyebrow", type: "text", max: 60, hint: "The small line above the heading." },
  { key: "title", label: "Heading", type: "text", max: 120, required: true },
  { key: "intro", label: "Intro", type: "textarea", max: introMax },
];

const image = (label = "Image"): FieldSpec[] => [
  { key: "image", label, type: "image", required: true, hint: IMAGE_HINT },
  { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
];

/** An event page's banner: heading, intro and its image. */
const eventHero = (imageLabel: string): FieldSpec[] => [
  { key: "eyebrow", label: "Eyebrow", type: "text", max: 60, heading: "Banner", hint: "The small line above the heading." },
  { key: "title", label: "Heading", type: "text", max: 120, required: true },
  { key: "lead", label: "Intro", type: "textarea", max: 400 },
  ...image(imageLabel),
];

/** One of the boxes under an event's banner: the big line, and the small one under it. */
const eventFact = (key: string, label: string, example: string, detailExample: string): FieldSpec[] => [
  {
    key,
    label,
    type: "text",
    max: 40,
    required: true,
    placeholder: example,
    ...(key === "date" && { heading: "Key facts", hint: "The big line in the box." }),
  },
  { key: `${key}Detail`, label: `${label} detail`, type: "text", max: 80, placeholder: detailExample, hint: "The small line under it." },
];

export const SECTION_SPECS: SectionSpec[] = [
  {
    key: SITE_SECTION_KEYS.homeEvents,
    page: "home",
    label: "Upcoming Events",
    description: "The event cards near the top of the home page.",
    href: "/#events",
    fields: sectionHead(),
    lists: [
      {
        key: "items",
        label: "Events",
        itemLabel: "Event",
        titleField: "title",
        hint: "The first event is shown larger, as the featured event.",
        min: 1,
        max: 6,
        fields: [
          ...image(),
          { key: "dateChip", label: "Date badge", type: "text", max: 40, placeholder: "18 DEC 2026", hint: "Shown on the image." },
          { key: "caption", label: "Image caption", type: "text", max: 60, placeholder: "Annual Dinner" },
          { key: "date", label: "Date line", type: "text", max: 80, placeholder: "Friday, 18 December 2026" },
          { key: "title", label: "Title", type: "text", max: 150, required: true },
          { key: "desc", label: "Description", type: "textarea", max: 300 },
          { key: "ctaLabel", label: "Button text", type: "text", max: 40, placeholder: "View Details →" },
          { key: "ctaHref", label: "Button link", type: "link", hint: LINK_HINT },
        ],
      },
    ],
  },
  {
    key: SITE_SECTION_KEYS.homeNotices,
    page: "home",
    label: "News & Notices",
    description: "The OCA Notice Board carousel: AGM notices, elections and updates.",
    href: "/#notices",
    fields: [
      ...sectionHead(),
      { key: "updatedLabel", label: "Updated badge", type: "text", max: 60, placeholder: "Updated Nov 19, 2025", hint: "Leave empty to hide it." },
    ],
    lists: [
      {
        key: "items",
        label: "Notices",
        itemLabel: "Notice",
        titleField: "title",
        min: 1,
        max: 12,
        fields: [
          ...image(),
          { key: "date", label: "Date", type: "text", max: 60, placeholder: "November 19, 2025" },
          { key: "title", label: "Title", type: "text", max: 150, required: true },
          { key: "href", label: "“Read more” link", type: "link", hint: `${LINK_HINT} Leave empty to hide the link.` },
        ],
      },
    ],
  },
  {
    key: SITE_SECTION_KEYS.homeSpotlight,
    page: "home",
    label: "Columban Newsmakers",
    description: "In the spotlight: the Columban the Association is celebrating.",
    href: "/#spotlight",
    fields: [
      ...sectionHead(),
      ...image("Poster"),
      { key: "pill", label: "Tag", type: "text", max: 60, placeholder: "News Makers · Achievers" },
      { key: "headline", label: "Headline", type: "text", max: 150, required: true },
      { key: "body", label: "Story", type: "textarea", max: 1000 },
      { key: "linkLabel", label: "Link text", type: "text", max: 60, placeholder: "See more News Makers →" },
      { key: "linkHref", label: "Link", type: "link", hint: `${LINK_HINT} Leave empty to hide the link.` },
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.homeHangout,
    page: "home",
    label: "OCA Hangout",
    description: "Photos and videos from the community, in a sliding carousel.",
    href: "/#hangout",
    fields: [
      ...sectionHead(300),
      { key: "highlight", label: "Words to highlight", type: "text", max: 60, hint: "Words from the intro to show in gold, e.g. “posted live”." },
    ],
    lists: [
      {
        key: "posts",
        label: "Posts",
        itemLabel: "Post",
        titleField: "caption",
        min: 1,
        max: 16,
        fields: [
          {
            key: "type",
            label: "Kind",
            type: "select",
            required: true,
            options: [
              { value: "photo", label: "Photo" },
              { value: "video", label: "Video" },
            ],
          },
          { key: "duration", label: "Video length", type: "text", max: 10, placeholder: "2:14", hint: "Videos only." },
          ...image(),
          { key: "name", label: "Posted by", type: "text", max: 80, placeholder: "R. Kapoor" },
          { key: "batch", label: "Batch", type: "text", max: 30, placeholder: "Batch '88" },
          { key: "caption", label: "Caption", type: "textarea", max: 280, required: true },
          { key: "time", label: "When", type: "text", max: 40, placeholder: "2 days ago" },
        ],
      },
    ],
  },
  {
    key: SITE_SECTION_KEYS.homeSocial,
    page: "home",
    label: "OCA Social Conscience",
    description: "The causes Columbans can support, with the featured fund’s progress.",
    href: "/#give",
    fields: sectionHead(),
    lists: [
      {
        key: "causes",
        label: "Causes",
        itemLabel: "Cause",
        titleField: "title",
        min: 1,
        max: 6,
        fields: [
          {
            key: "status",
            label: "Display",
            type: "select",
            required: true,
            options: [
              { value: "featured", label: "Featured: progress bar and Contribute button" },
              { value: "muted", label: "Muted: a short note (suspended, coming soon)" },
            ],
          },
          { key: "badge", label: "Badge", type: "text", max: 40, placeholder: "Featured Cause" },
          ...image(),
          { key: "title", label: "Title", type: "text", max: 120, required: true },
          { key: "desc", label: "Note", type: "textarea", max: 300, hint: "Shown on muted causes." },
          { key: "progress", label: "Progress (%)", type: "number", min: 0, max: 100, hint: "Featured causes only." },
          { key: "raised", label: "Raised", type: "text", max: 40, placeholder: "₹15,68,928" },
          { key: "goal", label: "Goal", type: "text", max: 40, placeholder: "₹2,00,00,000" },
          { key: "ctaHref", label: "Contribute link", type: "link", hint: LINK_HINT },
          { key: "href", label: "About link", type: "link", hint: `${LINK_HINT} Leave empty to hide it.` },
        ],
      },
    ],
  },
  {
    key: SITE_SECTION_KEYS.aboutCommittee,
    page: "about",
    label: "Executive Committee",
    description: "The three office bearers shown near the bottom of the home page and in the current committee on the Executive Committee page: photo, name and role.",
    href: "/#committee",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", max: 60, hint: "The small line above the heading." },
      { key: "title", label: "Heading", type: "text", max: 120, required: true, placeholder: "Executive Committee, 2025 – 27" },
    ],
    lists: [
      {
        key: "members",
        label: "Office bearers",
        itemLabel: "Member",
        titleField: "name",
        hint: "The section shows exactly three members. Use the arrows to change their order.",
        min: 3,
        max: 3,
        fields: [
          // Optional: a bearer without a photo shows their initials instead.
          { key: "image", label: "Photo", type: "image", hint: IMAGE_HINT },
          { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
          { key: "name", label: "Name", type: "text", max: 100, required: true },
          { key: "role", label: "Role", type: "text", max: 60, required: true, placeholder: "President" },
          { key: "initials", label: "Initials", type: "text", max: 4, placeholder: "SVK", hint: "Shown while the photo loads. Left empty, they come from the name." },
        ],
      },
    ],
  },
  {
    key: SITE_SECTION_KEYS.eventsDinner,
    page: "events",
    label: "Annual Dinner",
    description: "The Annual Dinner page: banner, date and venue, and the “Choose your pass” heading.",
    href: "/annual-dinner",
    fields: [
      ...eventHero("Poster"),
      ...eventFact("date", "Date", "18 December", "Friday, 2026"),
      ...eventFact("venue", "Venue", "Qutub Golf Course", "New Delhi"),
      { key: "priceFact", label: "Price box", type: "text", max: 40, placeholder: "₹2,500", hint: "Only the text in the box. Pass prices themselves are set with the passes." },
      { key: "priceDetail", label: "Price box detail", type: "text", max: 80, placeholder: "Passes from — limited numbers" },
      { key: "passesEyebrow", label: "Eyebrow", type: "text", max: 60, heading: "Choose your pass", placeholder: "Passes" },
      { key: "passesTitle", label: "Heading", type: "text", max: 120, required: true, placeholder: "Choose your pass" },
      { key: "passesIntro", label: "Intro", type: "textarea", max: 400 },
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.eventsLunch,
    page: "events",
    label: "Annual Lunch",
    description: "The Annual Lunch page: banner, date, time and venue.",
    href: "/annual-lunch",
    fields: [
      ...eventHero("Banner image"),
      ...eventFact("date", "Date", "14 December", "Sunday, 2025"),
      ...eventFact("time", "Time", "12 Noon", "Onwards"),
      ...eventFact("venue", "Venue", "St. Columba’s", "School Grounds, Ashoka Place, New Delhi – 110 001"),
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.eventsSports,
    page: "events",
    label: "OCA Sports",
    description: "The OCA Sports page: tournament banner, dates and venue, and the sponsorship appeal.",
    href: "/sports",
    fields: [
      ...eventHero("Tournament poster"),
      { key: "posterChip", label: "Poster tag", type: "text", max: 30, placeholder: "2022 EDITION", hint: "The small tag on the poster. Leave empty to hide it." },
      ...eventFact("date", "Dates", "5–12 November", "2022 Edition"),
      ...eventFact("venue", "Venue", "St. Columba’s", "School Grounds, Ashoka Place, New Delhi"),
      { key: "sponsorEyebrow", label: "Eyebrow", type: "text", max: 60, heading: "Sponsorship appeal", placeholder: "Support the Game" },
      { key: "sponsorTitle", label: "Heading", type: "text", max: 120, required: true, placeholder: "Brother Oman Memorial Interschool Cricket Tournament" },
      { key: "sponsorAmount", label: "Amount sought", type: "text", max: 40, required: true, placeholder: "₹1.50 Lacs" },
      { key: "sponsorImage", label: "Appeal image", type: "image", required: true, hint: IMAGE_HINT },
      { key: "sponsorImageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.membershipFee,
    page: "membership",
    label: "Membership fee",
    description: "The one-time Life Membership fee: shown on the membership form and charged at checkout.",
    href: "/membership",
    fields: [
      {
        key: "fee",
        label: "Life Membership fee (₹)",
        type: "number",
        required: true,
        min: 1,
        max: 1000000,
        integer: true,
        hint: "Whole rupees. New applications are charged this from the moment you save; anyone already at the payment step pays the fee they were shown.",
      },
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.settingsEmails,
    page: "settings",
    label: "Email settings",
    description: "Who else receives a copy of the emails the website sends to members.",
    fields: [
      {
        key: "registrationCc",
        label: "CC on website emails",
        type: "emails",
        max: 1000,
        placeholder: "ocacentre@gmail.com, secretary@example.com",
        hint: "Copied on every email the website sends: membership welcomes, Annual Dinner passes, contribution thank-yous and Suggestion Box messages. “Get in touch” messages go only to the email under Contact details. Password reset emails are never copied, as their link lets anyone set the member's password. Separate addresses with commas; leave empty to copy no one.",
      },
    ],
    lists: [],
  },
  {
    key: SITE_SECTION_KEYS.settingsContact,
    page: "settings",
    label: "Contact details",
    description: "The email, phone and address shown in the footer, on every page that asks members to get in touch, and in the website's emails.",
    href: "/#contact",
    fields: [
      { key: "name", label: "Contact name", type: "text", max: 80, required: true, heading: "Contact", placeholder: "The OCA Secretariat", hint: "Who members reach, and who signs the website's emails." },
      { key: "email", label: "Email", type: "email", max: 255, required: true, placeholder: "info@oldcolumban.net", hint: "Shown on the site and in emails. Suggestion Box and “Get in touch” messages are sent here." },
      { key: "phone", label: "Phone", type: "text", max: 30, required: true, placeholder: "011-23748666", hint: "As it should read. Tapping it calls the digits." },
      { key: "address", label: "Address", type: "textarea", max: 200, required: true, placeholder: "St. Columba’s School, Ashoka Place, New Delhi – 110 001" },
      { key: "facebook", label: "Facebook", type: "link", heading: "Social media", placeholder: "https://www.facebook.com/…", hint: SOCIAL_HINT },
      { key: "x", label: "X (Twitter)", type: "link", placeholder: "https://x.com/…", hint: SOCIAL_HINT },
      { key: "instagram", label: "Instagram", type: "link", placeholder: "https://www.instagram.com/…", hint: SOCIAL_HINT },
      { key: "youtube", label: "YouTube", type: "link", placeholder: "https://www.youtube.com/@…", hint: SOCIAL_HINT },
      { key: "linkedin", label: "LinkedIn", type: "link", placeholder: "https://www.linkedin.com/…", hint: SOCIAL_HINT },
    ],
    lists: [],
  },
];

export const sectionSpec = (key: string): SectionSpec | undefined => SECTION_SPECS.find((spec) => spec.key === key);
