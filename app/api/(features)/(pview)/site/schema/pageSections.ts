// The editable sections of the About, Gallery, Directory and OCA Connect pages: one section per
// page, holding everything on it that the Secretariat may want to change. Merged into
// SECTION_SPECS (sectionSpecs.ts), so the server validates saves against these and the admin panel
// builds its forms from them, like every other section. Their defaults are in services/pageDefaults.ts.
//
// Some pages also show content kept elsewhere, so it is edited in one place only:
//   - OCA Social Conscience and Teachers Benevolent Fund: the causes, their goals and live fund
//     totals, from Home page → OCA Social Conscience and the paid contributions.
//   - Photographs: the albums, from Home page → Our Gallery.
//   - Newsletters: the latest notices, from Home page → News & Notices.
//   - School Anthem: the School motto, from Gallery → History of the School.
//
// Only type imports from sectionSpecs.ts: it imports this file's values, so nothing may run in a cycle.
// No server-only imports: the admin panel (a client component) imports this file too.

import type { FieldSpec, ListSpec, SectionSpec } from "./sectionSpecs";

export const PAGE_SECTION_KEYS = {
  aboutBatchCoordinators: "about.batch-coordinators",
  aboutSocialConscience: "about.social-conscience",
  aboutTeachersFund: "about.teachers-benevolent-fund",
  aboutBylaws: "about.bylaws",
  galleryAnthem: "gallery.school-anthem",
  galleryHistory: "gallery.school-history",
  galleryPrincipal: "gallery.our-principal",
  galleryMagazine: "gallery.school-magazine",
  galleryPhotographs: "gallery.event-photographs",
  directoryBatchmates: "directory.find-your-batchmates",
  directoryChapters: "directory.worldwide-chapters",
  connectNewsMakers: "connect.news-makers",
  connectAlumniServices: "connect.alumni-services",
  connectCareers: "connect.careers",
  connectNetworking: "connect.networking",
  connectInternships: "connect.internships",
  connectNewsletters: "connect.newsletters",
  connectRemembrance: "connect.remembrance",
} as const;

export type PageSectionKey = (typeof PAGE_SECTION_KEYS)[keyof typeof PAGE_SECTION_KEYS];

// ---------- Shared shapes ----------

/** The banner at the top of a page: heading and intro on the left, a photo on the right. */
export interface PageHeroContent {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  /** The line over the bottom of the photo; empty for none. */
  imageCaption: string;
}

/** The green band near the bottom of most pages. Its buttons are fixed per page. */
export interface PageCtaContent {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
}

/** A heading with a short text, for numbered steps, rules and cards. */
export interface TitledText {
  title: string;
  text: string;
}

/** "Coming soon" pages: the box that says what is on its way. */
export interface ComingSoonContent extends PageHeroContent {
  soonTitle: string;
  soonText: string;
}

// ---------- About ----------

export interface BatchCoordinatorsContent extends PageHeroContent {
  boardEyebrow: string;
  boardTitle: string;
  boardLead: string;
  traits: { label: string }[];
  cardBadge: string;
  /** Who to call: shown on the card and on the banner's button ("Call Mr Amit Bansal"). */
  contactName: string;
  /** As it should read; the call link is made from its digits. */
  contactPhone: string;
  cardNote: string;
}

/** The page's own text; the causes themselves come from Home page → OCA Social Conscience. */
export interface SocialConsciencePageContent extends PageHeroContent, PageCtaContent {
  causesEyebrow: string;
  causesTitle: string;
}

export interface TeachersFundMember {
  name: string;
  role: string;
  term: string;
  /** "fixed": a fixed term (gold tag); "ec": for the term of the Executive Committee (green tag). */
  termKind: "fixed" | "ec";
}

/**
 * The fund's own page. Its figures are live: paid contributions to `fund`, plus the goal and the
 * money raised offline set on the cause with the same fund code (Home page → OCA Social Conscience).
 */
export interface TeachersFundContent extends PageCtaContent {
  eyebrow: string;
  title: string;
  lead: string;
  fund: string;
  committeeEyebrow: string;
  committeeTitle: string;
  committeeIntro: string;
  members: TeachersFundMember[];
  termNote: string;
  rulesEyebrow: string;
  rulesTitle: string;
  rules: TitledText[];
}

export interface BylawsContent extends PageHeroContent {
  /** The ByLaws as one PDF, for the download button. */
  pdf: string;
  downloadLabel: string;
  downloadNote: string;
  /** The pages as images, read on the page; with none, the PDF is shown instead. */
  pages: { image: string; imageAlt: string }[];
}

// ---------- Gallery ----------

export interface AnthemDownload {
  label: string;
  note: string;
  file: string;
}

export interface AnthemContent extends PageCtaContent {
  eyebrow: string;
  title: string;
  lead: string;
  /** A YouTube address (watch, share or embed link) of the anthem. */
  video: string;
  downloadsEyebrow: string;
  downloadsTitle: string;
  downloads: AnthemDownload[];
  lyricsEyebrow: string;
  lyricsTitle: string;
  /** One line per line of the song; a blank line starts a new verse. */
  lyrics: string;
}

export interface HistoryStat {
  value: string;
  /** Set small and raised after the figure, e.g. "+". */
  suffix: string;
  label: string;
}

export interface HistoryMilestone {
  date: string;
  title: string;
  text: string;
  /** "yes": drawn as a major milestone (filled marker). */
  major: "yes" | "no";
}

export interface SchoolHistoryContent extends PageHeroContent, PageCtaContent {
  schoolUrl: string;
  stats: HistoryStat[];
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  introImage: string;
  introImageAlt: string;
  introCaption: string;
  /** The School motto, in Latin as two phrases: here and on the School Anthem page. */
  mottoLatin1: string;
  mottoLatin2: string;
  mottoTranslation: string;
  mottoCaption: string;
  timelineEyebrow: string;
  timelineTitle: string;
  timelineIntro: string;
  timeline: HistoryMilestone[];
  academicsEyebrow: string;
  academicsTitle: string;
  academicsBody: string;
  academicsImage: string;
  academicsImageAlt: string;
  academicsCaption: string;
  pillars: TitledText[];
  quoteEyebrow: string;
  quote: string;
  quoteAfter: string;
  recognitionEyebrow: string;
  recognitionTitle: string;
  recognitions: TitledText[];
}

export interface PrincipalContent extends PageCtaContent {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  storyEyebrow: string;
  storyTitle: string;
  blocks: { heading: string; body: string }[];
  timelineBadge: string;
  timeline: { year: string; event: string }[];
}

export interface MagazineFeature {
  kicker: string;
  year: string;
  desc: string;
  image: string;
  href: string;
}

export interface MagazineEdition {
  /** "1962" or "1981-82": the decade filter comes from its first year. */
  year: string;
  image: string;
  href: string;
}

export interface MagazineContent extends PageCtaContent {
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredIntro: string;
  featured: MagazineFeature[];
  archiveEyebrow: string;
  archiveTitle: string;
  editions: MagazineEdition[];
  membersNote: string;
}

/** The page's own text; the albums come from Home page → Our Gallery. */
export interface PhotographsContent extends PageHeroContent, PageCtaContent {
  soonTitle: string;
  soonText: string;
}

// ---------- Directory ----------

export interface BatchmatesContent extends PageHeroContent, PageCtaContent {
  howEyebrow: string;
  howTitle: string;
  howIntro: string;
  steps: TitledText[];
  searchEyebrow: string;
  searchTitle: string;
  searchText: string;
  visibilityEyebrow: string;
  visibilityTitle: string;
  visibilityIntro: string;
  /** Comma-separated: what shows on a member's entry by default, and what stays hidden. */
  shownTags: string;
  hiddenTags: string;
}

// ---------- OCA Connect ----------

export interface NewsMakerProfile {
  image: string;
  imageAlt: string;
  chip: string;
  name: string;
  batch: string;
  bio: string;
  linkLabel: string;
  linkHref: string;
}

export interface NewsMakersContent extends PageHeroContent, PageCtaContent {
  profilesEyebrow: string;
  profilesTitle: string;
  profilesIntro: string;
  profiles: NewsMakerProfile[];
}

export interface InternshipsContent extends PageHeroContent, PageCtaContent {
  facts: { value: string; label: string }[];
  hostEyebrow: string;
  hostTitle: string;
  hostIntro: string;
  hostSteps: TitledText[];
  applyEyebrow: string;
  applyTitle: string;
  applyText: string;
}

export interface NewsletterIssue {
  date: string;
  title: string;
  image: string;
  file: string;
}

/** The page's own text and newsletter archive; the latest notices come from Home page → News & Notices. */
export interface NewslettersContent extends PageHeroContent, PageCtaContent {
  noticesEyebrow: string;
  noticesTitle: string;
  noticesIntro: string;
  archiveEyebrow: string;
  archiveTitle: string;
  archiveIntro: string;
  issues: NewsletterIssue[];
  olderNote: string;
  emailEyebrow: string;
  emailTitle: string;
  emailIntro: string;
}

export interface RemembranceEntry {
  image: string;
  imageAlt: string;
  name: string;
  meta: string;
  quote: string;
  text: string;
}

export interface RemembranceContent extends PageHeroContent {
  rollEyebrow: string;
  rollTitle: string;
  rollIntro: string;
  entries: RemembranceEntry[];
  howEyebrow: string;
  howTitle: string;
  ways: TitledText[];
  quote: string;
  quoteAfter: string;
}

/** Each page section's content, by its key. */
export interface PageContentMap {
  "about.batch-coordinators": BatchCoordinatorsContent;
  "about.social-conscience": SocialConsciencePageContent;
  "about.teachers-benevolent-fund": TeachersFundContent;
  "about.bylaws": BylawsContent;
  "gallery.school-anthem": AnthemContent;
  "gallery.school-history": SchoolHistoryContent;
  "gallery.our-principal": PrincipalContent;
  "gallery.school-magazine": MagazineContent;
  "gallery.event-photographs": PhotographsContent;
  "directory.find-your-batchmates": BatchmatesContent;
  "directory.worldwide-chapters": ComingSoonContent;
  "connect.news-makers": NewsMakersContent;
  "connect.alumni-services": ComingSoonContent;
  "connect.careers": ComingSoonContent;
  "connect.networking": ComingSoonContent;
  "connect.internships": InternshipsContent;
  "connect.newsletters": NewslettersContent;
  "connect.remembrance": RemembranceContent;
}

// ---------- Spec helpers ----------

const IMAGE_HINT = "Upload a JPG, PNG or WebP, or paste an image address.";
const ALT_HINT = "Describes the image for screen readers and search engines.";
const LINK_HINT = "A page on this site (/membership) or a full address (https://…).";
const PDF_HINT = "Upload a PDF (up to 25 MB), or paste the address of one already online.";
const PROSE_HINT = "Leave a blank line between paragraphs. Wrap words in **double stars** for bold, or *single stars* for italics.";

const eyebrowField = (key: string, heading?: string): FieldSpec => ({
  key,
  label: "Eyebrow",
  type: "text",
  max: 60,
  hint: "The small line above the heading.",
  ...(heading && { heading }),
});

/** The banner: heading, intro and its photo, with the line over the photo. */
const pageHero = (imageLabel = "Banner photo"): FieldSpec[] => [
  eyebrowField("eyebrow", "Banner"),
  { key: "title", label: "Heading", type: "text", max: 120, required: true },
  { key: "lead", label: "Intro", type: "textarea", max: 600 },
  { key: "image", label: imageLabel, type: "image", required: true, hint: IMAGE_HINT },
  { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
  { key: "imageCaption", label: "Caption on the photo", type: "text", max: 80, hint: "The line over the bottom of the photo. Leave empty for none." },
];

/** A banner without a photo (the photo's place holds something else, e.g. the fund's progress). */
const textHero = (): FieldSpec[] => [
  eyebrowField("eyebrow", "Banner"),
  { key: "title", label: "Heading", type: "text", max: 120, required: true },
  { key: "lead", label: "Intro", type: "textarea", max: 800 },
];

/** Eyebrow, heading and (optionally) an intro for a section of the page, under its own heading in the editor. */
const block = (prefix: string, heading: string, intro: "intro" | "none" = "intro", introMax = 600): FieldSpec[] => [
  eyebrowField(`${prefix}Eyebrow`, heading),
  { key: `${prefix}Title`, label: "Heading", type: "text", max: 200, required: true },
  ...(intro === "intro" ? [{ key: `${prefix}Intro`, label: "Intro", type: "textarea", max: introMax } as FieldSpec] : []),
];

/** The green band near the bottom of the page. */
const ctaBand = (): FieldSpec[] => [
  eyebrowField("ctaEyebrow", "Closing banner"),
  { key: "ctaTitle", label: "Heading", type: "text", max: 120, required: true },
  { key: "ctaText", label: "Text", type: "textarea", max: 300 },
];

/** A list of headed texts: numbered steps, rules, cards. */
const titledList = (key: string, label: string, itemLabel: string, max: number, hint?: string, min = 0): ListSpec => ({
  key,
  label,
  itemLabel,
  titleField: "title",
  hint,
  min,
  max,
  fields: [
    { key: "title", label: "Heading", type: "text", max: 120, required: true },
    { key: "text", label: "Text", type: "textarea", max: 500 },
  ],
});

const comingSoonFields = (): FieldSpec[] => [
  ...pageHero(),
  { key: "soonTitle", label: "Heading", type: "text", max: 120, required: true, heading: "Coming soon box" },
  { key: "soonText", label: "Text", type: "textarea", max: 600 },
];

// ---------- Specs ----------

export const PAGE_SECTION_SPECS: SectionSpec[] = [
  // ----- About -----
  {
    key: PAGE_SECTION_KEYS.aboutBatchCoordinators,
    page: "about",
    label: "Batch Coordinators",
    description: "The Batch Coordinators page: who to call to represent an unrepresented batch.",
    href: "/batch-coordinators",
    fields: [
      ...pageHero(),
      ...block("board", "Get on board", "none"),
      { key: "boardLead", label: "Text", type: "textarea", max: 400 },
      { key: "cardBadge", label: "Card badge", type: "text", max: 30, heading: "Contact card", placeholder: "Get in touch" },
      { key: "contactName", label: "Who to call", type: "text", max: 80, required: true, placeholder: "Mr Amit Bansal", hint: "Shown on the card and on the banner's button (“Call Mr Amit Bansal”)." },
      { key: "contactPhone", label: "Phone", type: "text", max: 30, required: true, placeholder: "+91 96506 66600", hint: "As it should read. Tapping it calls the digits." },
      { key: "cardNote", label: "Line under the number", type: "text", max: 60, placeholder: "to get on board" },
    ],
    lists: [
      {
        key: "traits",
        label: "Qualities",
        itemLabel: "Quality",
        titleField: "label",
        hint: "The short tags under the text, e.g. Passionate.",
        min: 0,
        max: 6,
        fields: [{ key: "label", label: "Quality", type: "text", max: 30, required: true }],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.aboutSocialConscience,
    page: "about",
    label: "OCA Social Conscience",
    description: "The OCA Social Conscience page. The causes, their goals and live fund totals are edited under Home page → OCA Social Conscience, so both pages always match.",
    href: "/social-conscience",
    fields: [...pageHero(), ...block("causes", "Causes", "none"), ...ctaBand()],
    lists: [],
  },
  {
    key: PAGE_SECTION_KEYS.aboutTeachersFund,
    page: "about",
    label: "Teachers Benevolent Fund",
    description: "The Teachers Benevolent Fund page: its story, Managing Committee and rules, with the fund's live total.",
    href: "/teachers-benevolent-fund",
    fields: [
      ...textHero(),
      {
        key: "fund",
        label: "Fund code",
        type: "text",
        max: 30,
        required: true,
        heading: "Fund progress",
        placeholder: "tbf",
        hint: "The contribution head whose paid contributions make up the total (Contributions → Contribution heads). The goal and money raised offline are taken from the cause with this fund code (or, failing that, the cause titled like this page) under Home page → OCA Social Conscience, so both pages show the same figures.",
      },
      ...block("committee", "Managing Committee"),
      { key: "termNote", label: "Note under the members", type: "textarea", max: 400 },
      ...block("rules", "Rules", "none"),
      ...ctaBand(),
    ],
    lists: [
      {
        key: "members",
        label: "Committee members",
        itemLabel: "Member",
        titleField: "name",
        hint: "Lettered (a), (b), (c)… in this order. Use the arrows to change it.",
        min: 0,
        max: 12,
        fields: [
          { key: "name", label: "Name", type: "text", max: 100, required: true },
          { key: "role", label: "Role", type: "text", max: 120, placeholder: "Ex-Principal, SCS (2016–2022)" },
          { key: "term", label: "Term", type: "text", max: 60, placeholder: "Term: 5 years" },
          {
            key: "termKind",
            label: "Kind of term",
            type: "select",
            required: true,
            options: [
              { value: "fixed", label: "Fixed term (gold tag)" },
              { value: "ec", label: "For the term of the EC (green tag)" },
            ],
          },
        ],
      },
      titledList("rules", "Rules", "Rule", 15, "Numbered 01, 02… in this order."),
    ],
  },
  {
    key: PAGE_SECTION_KEYS.aboutBylaws,
    page: "about",
    label: "ByLaws of OCA",
    description: "The ByLaws page: the pages of the ByLaws to read on the site, and the PDF to download.",
    href: "/bylaws",
    fields: [
      ...pageHero(),
      { key: "pdf", label: "ByLaws PDF", type: "file", fileKind: "document", required: true, heading: "Download", hint: PDF_HINT },
      { key: "downloadLabel", label: "Button text", type: "text", max: 40, placeholder: "Download the ByLaws" },
      { key: "downloadNote", label: "Line under it", type: "text", max: 40, placeholder: "Tap to get the PDF" },
    ],
    lists: [
      {
        key: "pages",
        label: "Pages to read on the site",
        itemLabel: "Page",
        titleField: "imageAlt",
        hint: "Each page of the ByLaws as an image (A4 portrait, about 1240 × 1754 px), in order. With no pages here, the PDF itself is shown on the page.",
        min: 0,
        max: 60,
        layout: "grid",
        fields: [
          { key: "image", label: "Page", type: "image", required: true },
          { key: "imageAlt", label: "Description", type: "text", max: 200, hint: "e.g. “OCA ByLaws, page 1 of 12”." },
        ],
      },
    ],
  },

  // ----- Gallery -----
  {
    key: PAGE_SECTION_KEYS.galleryAnthem,
    page: "gallery",
    label: "School Anthem",
    description: "The School Anthem page: the video, the recordings to download, and the words. The motto under it is edited under Gallery → History of the School.",
    href: "/school-anthem",
    fields: [
      ...textHero(),
      {
        key: "video",
        label: "YouTube video",
        type: "link",
        required: true,
        placeholder: "https://www.youtube.com/watch?v=…",
        hint: "The anthem on YouTube: its watch, share or embed address. The play button by the words plays this video.",
      },
      ...block("downloads", "Downloads", "none"),
      ...block("lyrics", "The words", "none"),
      { key: "lyrics", label: "Lyrics", type: "textarea", max: 4000, required: true, hint: "One line of the song per line. Leave a blank line between verses." },
      ...ctaBand(),
    ],
    lists: [
      {
        key: "downloads",
        label: "Recordings",
        itemLabel: "Recording",
        titleField: "label",
        min: 0,
        max: 6,
        fields: [
          { key: "label", label: "Title", type: "text", max: 60, required: true, placeholder: "Download Song 1" },
          { key: "note", label: "Note", type: "text", max: 80, placeholder: "School Anthem · Audio · MP3" },
          { key: "file", label: "Recording", type: "file", fileKind: "audio", required: true, hint: "Upload an MP3 (up to 20 MB), or paste the address of a recording already online." },
        ],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.galleryHistory,
    page: "gallery",
    label: "History of the School",
    description: "The History of the School page: key figures, the story, the timeline and the School motto (also shown on the School Anthem page).",
    href: "/school-history",
    fields: [
      ...pageHero(),
      { key: "schoolUrl", label: "School website", type: "link", hint: "For the banner's “Visit the school website” button. Leave empty to hide it." },
      ...block("intro", "Our School", "none"),
      { key: "introBody", label: "Text", type: "textarea", max: 2000, hint: PROSE_HINT },
      { key: "introImage", label: "Photo", type: "image", required: true, hint: IMAGE_HINT },
      { key: "introImageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
      { key: "introCaption", label: "Caption", type: "text", max: 120 },
      { key: "mottoLatin1", label: "Motto, first phrase", type: "text", max: 60, required: true, heading: "School motto", placeholder: "Sapere aude", hint: "Shown here and on the School Anthem page." },
      { key: "mottoLatin2", label: "Motto, second phrase", type: "text", max: 60, placeholder: "sincere et constanter" },
      { key: "mottoTranslation", label: "Translation", type: "text", max: 120, placeholder: "Dare to be wise, sincere and constant." },
      { key: "mottoCaption", label: "Caption", type: "text", max: 160 },
      ...block("timeline", "Timeline"),
      ...block("academics", "Academics & character", "none"),
      { key: "academicsBody", label: "Text", type: "textarea", max: 1500, hint: PROSE_HINT },
      { key: "academicsImage", label: "Photo", type: "image", required: true, hint: IMAGE_HINT },
      { key: "academicsImageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
      { key: "academicsCaption", label: "Caption", type: "text", max: 120 },
      eyebrowField("quoteEyebrow", "Quote"),
      { key: "quote", label: "Quote", type: "textarea", max: 300, required: true },
      { key: "quoteAfter", label: "Text under the quote", type: "textarea", max: 600 },
      ...block("recognition", "Recognition", "none"),
      ...ctaBand(),
    ],
    lists: [
      {
        key: "stats",
        label: "Key figures",
        itemLabel: "Figure",
        titleField: "label",
        hint: "The strip of figures under the banner.",
        min: 0,
        max: 4,
        fields: [
          { key: "value", label: "Figure", type: "text", max: 12, required: true, size: "third", placeholder: "3000" },
          { key: "suffix", label: "After it", type: "text", max: 4, size: "third", placeholder: "+", hint: "Set small and raised." },
          { key: "label", label: "Label", type: "text", max: 60, required: true, size: "third", placeholder: "Students enrolled today" },
        ],
      },
      {
        key: "timeline",
        label: "Milestones",
        itemLabel: "Milestone",
        titleField: "title",
        min: 0,
        max: 30,
        inBlock: "Timeline",
        fields: [
          { key: "date", label: "Date", type: "text", max: 40, required: true, placeholder: "7 January 1941" },
          { key: "title", label: "Heading", type: "text", max: 120, required: true },
          { key: "text", label: "Text", type: "textarea", max: 400 },
          {
            key: "major",
            label: "Major milestone",
            type: "select",
            required: true,
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes: drawn with a filled marker" },
            ],
          },
        ],
      },
      { ...titledList("pillars", "Points", "Point", 8, "The list beside the photo."), inBlock: "Academics & character" },
      { ...titledList("recognitions", "Honours", "Honour", 6), inBlock: "Recognition" },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.galleryPrincipal,
    page: "gallery",
    label: "School Principal",
    description: "The About Our Principal page: portrait, story and his journey at a glance.",
    href: "/our-principal",
    fields: [
      eyebrowField("eyebrow", "Banner"),
      { key: "title", label: "Name", type: "text", max: 120, required: true },
      { key: "lead", label: "Intro", type: "textarea", max: 600 },
      { key: "image", label: "Portrait", type: "image", required: true, hint: IMAGE_HINT },
      { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
      ...block("story", "Story", "none"),
      { key: "timelineBadge", label: "Timeline heading", type: "text", max: 40, heading: "Journey at a glance", placeholder: "Journey at a glance" },
      ...ctaBand(),
    ],
    lists: [
      {
        key: "blocks",
        label: "Story",
        itemLabel: "Part",
        titleField: "heading",
        min: 1,
        max: 10,
        inBlock: "Story",
        fields: [
          { key: "heading", label: "Heading", type: "text", max: 80, required: true, placeholder: "Early years" },
          { key: "body", label: "Text", type: "textarea", max: 2000, required: true, hint: PROSE_HINT },
        ],
      },
      {
        key: "timeline",
        label: "Milestones",
        itemLabel: "Milestone",
        titleField: "event",
        min: 0,
        max: 30,
        inBlock: "Journey at a glance",
        fields: [
          { key: "year", label: "Year", type: "text", max: 20, required: true, placeholder: "2014–16" },
          { key: "event", label: "What happened", type: "text", max: 160, required: true },
        ],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.galleryMagazine,
    page: "gallery",
    label: "School Magazine",
    description: "The School Magazine page: featured editions and the full archive of The Columban.",
    href: "/school-magazine",
    fields: [
      eyebrowField("eyebrow", "Banner"),
      { key: "title", label: "Heading", type: "text", max: 120, required: true },
      { key: "lead", label: "Intro", type: "textarea", max: 600 },
      { key: "image", label: "Banner photo", type: "image", required: true, hint: IMAGE_HINT },
      { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
      ...block("featured", "Featured editions"),
      ...block("archive", "Full archive", "none"),
      { key: "membersNote", label: "Note under the archive", type: "textarea", max: 400, hint: "Followed by links to sign in or become a member. Wrap words in **double stars** for bold." },
      ...ctaBand(),
    ],
    lists: [
      {
        key: "featured",
        label: "Featured editions",
        itemLabel: "Edition",
        titleField: "year",
        min: 0,
        max: 4,
        inBlock: "Featured editions",
        fields: [
          { key: "year", label: "Edition", type: "text", max: 20, required: true, placeholder: "1973" },
          { key: "kicker", label: "Tag", type: "text", max: 40, placeholder: "From the archive" },
          { key: "desc", label: "Description", type: "textarea", max: 300 },
          { key: "image", label: "Cover", type: "image", required: true, hint: IMAGE_HINT },
          { key: "href", label: "Magazine", type: "file", fileKind: "document", required: true, hint: `${PDF_HINT} A page link works too.` },
        ],
      },
      {
        key: "editions",
        label: "Editions",
        itemLabel: "Edition",
        titleField: "year",
        hint: "Shown in this order. The decade filters are made from the editions' years.",
        min: 0,
        max: 150,
        inBlock: "Full archive",
        fields: [
          { key: "year", label: "Edition", type: "text", max: 20, required: true, placeholder: "1981-82", hint: "A year, or a school year like 1981-82." },
          { key: "image", label: "Cover", type: "image", required: true, hint: IMAGE_HINT },
          { key: "href", label: "Magazine", type: "file", fileKind: "document", required: true, hint: `${PDF_HINT} A page link works too.` },
        ],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.galleryPhotographs,
    page: "gallery",
    label: "Photographs",
    description: "The Photographs page. Its albums and photos are edited under Home page → Our Gallery, so the home page and this page always match.",
    href: "/event-photographs",
    fields: [
      ...pageHero(),
      { key: "soonTitle", label: "Heading", type: "text", max: 120, required: true, heading: "Under the albums" },
      { key: "soonText", label: "Text", type: "textarea", max: 400 },
      ...ctaBand(),
    ],
    lists: [],
  },

  // ----- Directory -----
  {
    key: PAGE_SECTION_KEYS.directoryBatchmates,
    page: "directory",
    label: "Find Your Batchmates",
    description: "The Find Your Batchmates page: how the member directory works, and the search form.",
    href: "/find-your-batchmates",
    fields: [
      ...pageHero(),
      ...block("how", "How it works"),
      ...block("search", "Search", "none"),
      { key: "searchText", label: "Text", type: "textarea", max: 400 },
      ...block("visibility", "What members can see"),
      { key: "shownTags", label: "Shown by default", type: "text", max: 120, placeholder: "Batch, City", hint: "Separate with commas." },
      { key: "hiddenTags", label: "Hidden until switched on", type: "text", max: 120, placeholder: "Profession, Email, Phone", hint: "Separate with commas." },
      ...ctaBand(),
    ],
    lists: [{ ...titledList("steps", "Steps", "Step", 6, "Numbered 1, 2, 3… in this order."), inBlock: "How it works" }],
  },
  {
    key: PAGE_SECTION_KEYS.directoryChapters,
    page: "directory",
    label: "Worldwide Chapters",
    description: "The Worldwide Chapters & Office Bearers page.",
    href: "/worldwide-chapters",
    fields: comingSoonFields(),
    lists: [],
  },

  // ----- OCA Connect -----
  {
    key: PAGE_SECTION_KEYS.connectNewsMakers,
    page: "connect",
    label: "News Makers",
    description: "The News Makers page: profiles of Columbans who have made their mark.",
    href: "/news-makers",
    fields: [...pageHero(), ...block("profiles", "Profiles"), ...ctaBand()],
    lists: [
      {
        key: "profiles",
        label: "Profiles",
        itemLabel: "Profile",
        titleField: "name",
        min: 0,
        max: 40,
        inBlock: "Profiles",
        fields: [
          { key: "image", label: "Photo", type: "image", required: true, hint: IMAGE_HINT },
          { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
          { key: "chip", label: "Field", type: "text", max: 30, placeholder: "Judiciary" },
          { key: "name", label: "Name", type: "text", max: 100, required: true },
          { key: "batch", label: "Batch", type: "text", max: 40, placeholder: "Batch of 1972" },
          { key: "bio", label: "Profile", type: "textarea", max: 1500, hint: "Wrap words in *single stars* for italics, e.g. a book's title." },
          { key: "linkLabel", label: "Link text", type: "text", max: 60, placeholder: "Open the full feature →" },
          { key: "linkHref", label: "Link", type: "link", hint: `${LINK_HINT} Leave empty to hide the link.` },
        ],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.connectAlumniServices,
    page: "connect",
    label: "Alumni Services",
    description: "The Alumni Services page.",
    href: "/alumni-services",
    fields: comingSoonFields(),
    lists: [],
  },
  {
    key: PAGE_SECTION_KEYS.connectCareers,
    page: "connect",
    label: "Careers",
    description: "The Careers page.",
    href: "/careers",
    fields: comingSoonFields(),
    lists: [],
  },
  {
    key: PAGE_SECTION_KEYS.connectNetworking,
    page: "connect",
    label: "Networking",
    description: "The Networking page.",
    href: "/networking",
    fields: comingSoonFields(),
    lists: [],
  },
  {
    key: PAGE_SECTION_KEYS.connectInternships,
    page: "connect",
    label: "OCA Internships Program",
    description: "The OCA Internships Program page: what host firms are asked for, and how students apply.",
    href: "/internships",
    fields: [
      ...pageHero(),
      ...block("host", "For host firms"),
      ...block("apply", "For applicants", "none"),
      { key: "applyText", label: "Text", type: "textarea", max: 600 },
      ...ctaBand(),
    ],
    lists: [
      {
        key: "facts",
        label: "Key facts",
        itemLabel: "Fact",
        titleField: "value",
        hint: "The boxes under the banner.",
        min: 0,
        max: 3,
        fields: [
          { key: "value", label: "Figure", type: "text", max: 20, required: true, placeholder: "4–8 weeks" },
          { key: "label", label: "Text", type: "text", max: 120 },
        ],
      },
      { ...titledList("hostSteps", "What we ask", "Point", 6, "Numbered 1, 2, 3… in this order."), inBlock: "For host firms" },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.connectNewsletters,
    page: "connect",
    label: "Newsletters",
    description: "The Newsletters & Notices page: the newsletter archive and the email sign-up. The latest notices are edited under Home page → News & Notices.",
    href: "/newsletters",
    fields: [
      ...pageHero(),
      ...block("notices", "Latest notices"),
      ...block("archive", "Newsletter archive"),
      { key: "olderNote", label: "Note under the archive", type: "textarea", max: 400, hint: "Followed by the Secretariat's email. Wrap words in **double stars** for bold." },
      ...block("email", "By email"),
      ...ctaBand(),
    ],
    lists: [
      {
        key: "issues",
        label: "Newsletters",
        itemLabel: "Newsletter",
        titleField: "title",
        hint: "Newest first.",
        min: 0,
        max: 60,
        inBlock: "Newsletter archive",
        fields: [
          { key: "date", label: "Date", type: "text", max: 40, placeholder: "September 2018" },
          { key: "title", label: "Title", type: "text", max: 120, required: true, placeholder: "Volume 2018 – Issue 2" },
          { key: "image", label: "Cover", type: "image", required: true, hint: IMAGE_HINT },
          { key: "file", label: "Newsletter PDF", type: "file", fileKind: "document", required: true, hint: PDF_HINT },
        ],
      },
    ],
  },
  {
    key: PAGE_SECTION_KEYS.connectRemembrance,
    page: "connect",
    label: "Remembrance",
    description: "The Remembrance page: the roll of Columbans and masters the Association remembers.",
    href: "/remembrance",
    fields: [
      ...pageHero(),
      ...block("roll", "Roll of remembrance"),
      ...block("how", "How we remember", "none"),
      { key: "quote", label: "Quote", type: "textarea", max: 400, heading: "Quote", required: true },
      { key: "quoteAfter", label: "Under the quote", type: "text", max: 80 },
    ],
    lists: [
      {
        key: "entries",
        label: "Names",
        itemLabel: "Name",
        titleField: "name",
        hint: "Shown in this order; use the arrows to change it.",
        min: 0,
        max: 100,
        inBlock: "Roll of remembrance",
        fields: [
          { key: "image", label: "Photo", type: "image", hint: `${IMAGE_HINT} Optional.` },
          { key: "imageAlt", label: "Image description", type: "text", max: 200, hint: ALT_HINT },
          { key: "name", label: "Name", type: "text", max: 100, required: true },
          { key: "meta", label: "Line under the name", type: "text", max: 120, placeholder: "Batch of 1994 · passed away at 48" },
          { key: "quote", label: "Quote", type: "textarea", max: 300, hint: "Optional, shown in italics." },
          { key: "text", label: "Tribute", type: "textarea", max: 1200 },
        ],
      },
      { ...titledList("ways", "Ways we remember", "Way", 3, "Three cards, each with its own icon."), inBlock: "How we remember" },
    ],
  },
];
