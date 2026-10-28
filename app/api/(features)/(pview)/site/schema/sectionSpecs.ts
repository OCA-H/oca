// What each editable section of the site holds, in one place: the server validates saves against
// these specs, and the admin panel builds its forms from them. To make another section editable,
// add its spec here, its defaults in services/siteDefaults.ts, and read it where the page renders.
// No server-only imports: the admin panel (a client component) imports this file too.

export type FieldType = "text" | "textarea" | "image" | "link" | "select" | "number";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Longest text accepted, or the largest number. */
  max?: number;
  /** Smallest number accepted. */
  min?: number;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
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
  page: "home" | "about";
  label: string;
  description: string;
  /** Where the section sits on its page, for "View on site". */
  href: string;
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
  ctaLabel: string;
  ctaHref: string;
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
      { key: "ctaLabel", label: "Button text", type: "text", max: 40, placeholder: "View all →" },
      { key: "ctaHref", label: "Button link", type: "link", hint: LINK_HINT },
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
    description: "The three office bearers shown near the bottom of the home page: photo, name and role.",
    href: "/#committee",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", max: 60, hint: "The small line above the heading." },
      { key: "title", label: "Heading", type: "text", max: 120, required: true, placeholder: "Executive Committee, 2023 – 25" },
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
          ...image("Photo"),
          { key: "name", label: "Name", type: "text", max: 100, required: true },
          { key: "role", label: "Role", type: "text", max: 60, required: true, placeholder: "President" },
          { key: "initials", label: "Initials", type: "text", max: 4, placeholder: "SVK", hint: "Shown while the photo loads. Left empty, they come from the name." },
        ],
      },
    ],
  },
];

export const sectionSpec = (key: string): SectionSpec | undefined => SECTION_SPECS.find((spec) => spec.key === key);
