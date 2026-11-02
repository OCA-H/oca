import { ROUTES } from "@/app/(view)/common/helper/routes";
import { SECTION_SPECS, type SectionSpec, type SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

/** Panels that show records from the database rather than editing a section of the site. */
export type RecordPanel = "passes" | "bookings" | "golf-passes" | "golf-bookings" | "memberships" | "funds" | "contributions";

/** The open panel: the dashboard, the editor for one section (its key, e.g. "home.events"), or a record panel. */
export type AdminPanel = "dashboard" | SiteSectionKey | RecordPanel;

export type AdminIconName =
  | "dashboard"
  | "calendar"
  | "megaphone"
  | "star"
  | "camera"
  | "heart"
  | "page"
  | "user"
  | "globe"
  | "logout"
  | "back"
  | "go"
  | "ext"
  | "check"
  | "plus"
  | "trash"
  | "up"
  | "down"
  | "chevron"
  | "upload"
  | "image"
  | "video"
  | "shield"
  | "people"
  | "home"
  | "info"
  | "layers"
  | "moon"
  | "sun"
  | "trophy"
  | "flag"
  | "ticket"
  | "mail"
  | "phone"
  | "rupee";

export const SECTION_ICONS: Record<SiteSectionKey, AdminIconName> = {
  "home.ticker": "megaphone",
  "home.events": "calendar",
  "home.notices": "megaphone",
  "home.spotlight": "star",
  "home.hangout": "camera",
  "home.social": "heart",
  "home.gallery": "image",
  "about.committee": "people",
  "events.dinner": "moon",
  "events.golf": "flag",
  "events.lunch": "sun",
  "events.sports": "trophy",
  "membership.fee": "rupee",
  "settings.emails": "mail",
  "settings.contact": "phone",
};

/** The record panels, in menu order, under their menu group. Each has its own address, e.g. /sv/admin/passes. */
export const RECORD_PANELS: Record<RecordPanel, { group: string; label: string; description: string; icon: AdminIconName }> = {
  passes: {
    group: "Passes",
    label: "Dinner passes & seats",
    description: "Prices, seats left and which Annual Dinner passes are open for booking.",
    icon: "ticket",
  },
  bookings: {
    group: "Passes",
    label: "Dinner bookings",
    description: "Every Annual Dinner pass booking, with the member's details and payment.",
    icon: "people",
  },
  "golf-passes": {
    group: "Passes",
    label: "Golf passes & seats",
    description: "Prices, seats left and whether the Golf Tournament's Single and Couple passes are open for booking.",
    icon: "flag",
  },
  "golf-bookings": {
    group: "Passes",
    label: "Golf bookings",
    description: "Every Golf Tournament pass booking, with the member's details and payment.",
    icon: "people",
  },
  memberships: {
    group: "Members",
    label: "Memberships",
    description: "Every membership application and its payment. Confirm a payment here when CCAvenue took it but it still shows pending.",
    icon: "people",
  },
  funds: {
    group: "Contributions",
    label: "Contribution heads",
    description: "What members can contribute to: add a head, change the wording, turn a head on or off, or delete it.",
    icon: "heart",
  },
  contributions: {
    group: "Contributions",
    label: "Contributions",
    description: "Every contribution and its payment. Confirm a payment here when CCAvenue took it but it still shows pending.",
    icon: "rupee",
  },
};

/** The record panels' menu groups, in order, with their panels. */
export const RECORD_GROUPS: { group: string; icon: AdminIconName; panels: RecordPanel[] }[] = [
  { group: "Passes", icon: "ticket", panels: ["passes", "bookings", "golf-passes", "golf-bookings"] },
  { group: "Members", icon: "people", panels: ["memberships"] },
  { group: "Contributions", icon: "heart", panels: ["funds", "contributions"] },
];

/** The events whose passes the admin panel manages: each has a passes panel and a bookings panel. */
export const PASS_EVENTS = [
  { event: "annual-dinner", page: "Annual Dinner", href: ROUTES.ANNUAL_DINNER, passes: "passes", bookings: "bookings" },
  { event: "golf-tournament", page: "Golf Tournament", href: ROUTES.GOLF_TOURNAMENT, passes: "golf-passes", bookings: "golf-bookings" },
] as const satisfies readonly { event: string; page: string; href: string; passes: RecordPanel; bookings: RecordPanel }[];

export type PassEvent = (typeof PASS_EVENTS)[number];

/** A menu entry swaps the panel in place, leaves the admin panel, or is not ready yet. */
export interface AdminNavItem {
  label: string;
  icon: AdminIconName;
  panel?: AdminPanel;
  href?: string;
  soon?: boolean;
}

/** A heading in the menu with its entries. Collapsible groups fold away behind their heading. */
export interface AdminNavGroup {
  group: string;
  items: AdminNavItem[];
  collapsible?: boolean;
  /** Shown beside a collapsible group's heading. */
  icon?: AdminIconName;
}

const PAGE_GROUPS: Record<SectionSpec["page"], { group: string; icon: AdminIconName }> = {
  home: { group: "Home page", icon: "home" },
  about: { group: "About", icon: "info" },
  events: { group: "Events", icon: "calendar" },
  membership: { group: "Membership", icon: "people" },
  settings: { group: "Settings", icon: "mail" },
};

const sectionItems = (page: SectionSpec["page"]): AdminNavItem[] =>
  SECTION_SPECS.filter((spec) => spec.page === page).map((spec) => ({
    label: spec.label,
    icon: SECTION_ICONS[spec.key],
    panel: spec.key,
  }));

export const adminContent = {
  breadcrumb: { homeText: "Home", homeHref: ROUTES.HOME, membersText: "Members", membersHref: ROUTES.PROFILE, pageText: "Admin panel" },
  hero: { eyebrow: "Admin panel", title: "Manage the website", chip: "Administrator" },

  nav: [
    { group: "Overview", items: [{ label: "Dashboard", icon: "dashboard", panel: "dashboard" }] },
    ...Object.entries(PAGE_GROUPS).map(([page, { group, icon }]) => ({
      group,
      icon,
      collapsible: true,
      items: sectionItems(page as SectionSpec["page"]),
    })),
    ...RECORD_GROUPS.map(({ group, icon, panels }) => ({
      group,
      icon,
      collapsible: true,
      items: panels.map((panel) => ({ label: RECORD_PANELS[panel].label, icon: RECORD_PANELS[panel].icon, panel })),
    })),
    {
      group: "Account",
      items: [
        { label: "My Profile", icon: "user", href: ROUTES.PROFILE },
        { label: "View website", icon: "globe", href: ROUTES.HOME },
      ],
    },
  ] as AdminNavGroup[],

  soonTag: "Soon",

  dashboard: {
    title: "Dashboard",
    lead: "Choose a section to change its text and images. Saved changes show on the website straight away.",
    pageTitle: (group: string) => `${group} sections`,
    saved: "Saved",
    notSaved: "Original content",
    edit: "Edit section",
  },

  editor: {
    viewOnSite: "View on site",
    lastSaved: "Last saved",
    defaults: "Showing the original content. Saving keeps it in the database, ready to edit.",
    sectionText: "Section text",
    items: (count: number, max: number) => `${count} of ${max}`,
    add: (label: string) => `Add ${label.toLowerCase()}`,
    untitled: (label: string) => `New ${label.toLowerCase()}`,
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    edit: "Edit",
    close: "Close",
    save: "Save changes",
    saving: "Saving…",
    discard: "Discard changes",
    saved: "Saved.",
    savedNote: "The website now shows your changes.",
    loadError: "We could not load this section.",
    retry: "Try again",
    unsaved: "Unsaved changes",
    uploading: "Uploading files…",
  },

  image: {
    upload: "Upload image",
    replace: "Replace image",
    pending: "New image: uploads when you save",
    types: /^image\/(png|jpe?g|webp)$/i,
    accept: "image/png,image/jpeg,image/webp",
    // Matches the server's limit (SITE_IMAGE_RULES); checked when chosen, not first at save.
    maxBytes: 10 * 1024 * 1024,
    badType: "Please choose a JPG, PNG or WebP image.",
    tooBig: "That image is over 10 MB. Please choose a smaller one.",
    none: "No image",
  },

  photos: {
    add: "Add photos",
    addNote: "Choose or drop several at once",
    cover: "Cover",
    replace: "Replace photo",
    moveEarlier: "Move earlier",
    moveLater: "Move later",
    empty: "No photos yet. Add at least one.",
    tooMany: (max: number) => `Only ${max} photos fit in one post; the extra ones were left out.`,
    skipped: (count: number, reason: string) => `${count} file${count === 1 ? " was" : "s were"} left out: ${reason}`,
  },

  video: {
    upload: "Upload video",
    replace: "Replace video",
    pending: "New video: uploads when you save.",
    types: /^video\/(mp4|quicktime|webm)$/i,
    accept: "video/mp4,video/quicktime,video/webm",
    // Matches the server's limit (SITE_VIDEO_RULES); checked when chosen, not first at save.
    maxBytes: 20 * 1024 * 1024,
    badType: "Please choose an MP4, MOV or WebM video.",
    tooBig: "That video is over 20 MB. Please choose a shorter or smaller one.",
    none: "No video yet",
  },

  records: {
    loadError: "We could not load this list.",
    retry: "Try again",
    refresh: "Refresh",
    empty: "Nothing here yet.",
    view: "Open",
  },

  passes: {
    viewOnSite: "View on site",
    seats: (left: number | null, total: number | null) =>
      total === null ? "Unlimited seats" : `${left ?? 0} of ${total} seats left`,
    sold: (paid: number) => `${paid} paid for`,
    open: "Open",
    locked: "Locked",
    soldOut: "Sold out",
    groups: {
      booking: { title: "Booking & seats", lead: "What members pay, and how many can still book." },
      card: { title: "Shown on the pass card", lead: "How this pass reads on its event page." },
    },
    confirm: {
      title: (label: string) => `Save changes to ${label}?`,
      body: (page: string) => `The ${page} page shows these straight away.`,
      yes: "Save changes",
      busy: "Saving…",
    },
    statusOptions: [
      { value: "active", label: "Open for booking" },
      { value: "locked", label: "Locked (shown, cannot be booked)" },
    ],
    stats: { seats: "Seats left", sold: "Passes paid for", revenue: "Taken in payments" },
    fields: {
      label: "Name on the site",
      price: "Price (₹)",
      totalQuantity: "Seats in total",
      availableQuantity: "Seats left",
      status: "Booking",
      statusNote: "Note on the card",
      batchEligibility: "Who can book",
      displayOrder: "Order on the page",
      description: "Description",
    },
    hints: {
      price: "Charged at checkout, and shown on the pass card and in the page's \"at a glance\" box.",
      availableQuantity: "Goes down by one with every paid booking.",
      statusNote: "Shown on the pass card. A note such as \"42 left\" keeps counting down by itself.",
    },
    save: "Save pass",
    saving: "Saving…",
    reset: "Undo changes",
    saved: (page: string) => `Saved. The ${page} page now shows your changes.`,
  },

  bookings: {
    search: "Search name, member ID, email or order",
    stats: { paid: "Paid bookings", revenue: "Taken in payments", oversold: "Paid after sell-out" },
    booked: "Booked",
    paidOn: "Paid",
    guests: (b: { spouseName: string | null; teachers: number; childrenUnder12: number; childrenAbove12: number }) =>
      [
        b.spouseName && `Spouse: ${b.spouseName}`,
        b.teachers > 0 && `${b.teachers} teacher${b.teachers === 1 ? "" : "s"}`,
        b.childrenUnder12 > 0 && `${b.childrenUnder12} under 12`,
        b.childrenAbove12 > 0 && `${b.childrenAbove12} over 12`,
      ].filter(Boolean).join(" · ") || "Member only",
    oversold: "Paid after the last pass went: follow up with the member.",
    shown: (from: number, to: number, total: number) => {
      const noun = total === 1 ? "booking" : "bookings";
      return total <= to - from + 1 ? `${total} ${noun}` : `${from}–${to} of ${total} ${noun}`;
    },
    none: "No bookings match.",
  },

  /** Shared by the bookings, memberships and contributions lists. */
  payments: {
    filters: [
      { value: "", label: "All" },
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    confirm: "Confirm payment",
    emailSent: "Email sent",
    emailPending: "Email not sent yet: retried automatically",
    reference: (ref: string) => `Ref ${ref}`,
    dialog: {
      title: "Confirm this payment?",
      body: (name: string, amount: string, orderId: string) =>
        `Only confirm after you have found order ${orderId} for ${amount} in the CCAvenue dashboard (Orders) with the status Shipped or Successful. ${name} will be marked paid and sent their email straight away.`,
      referenceLabel: "CCAvenue reference number",
      referenceHint: "The \"CCAvenue Ref. #\" shown beside this order in the dashboard, e.g. 114955902641.",
      confirm: "Confirm and send email",
      busy: "Confirming…",
    },
  },

  memberships: {
    search: "Search name, batch, email, mobile or order",
    stats: { paid: "Paid memberships", revenue: "Taken in fees", pending: "Awaiting payment" },
    applied: "Applied",
    paidOn: "Paid",
    batch: (batch: string) => (batch ? `Batch ${batch}` : "No batch given"),
    noAccount: "Paid, but the member's account is not made yet: retried automatically.",
    shown: (from: number, to: number, total: number) => {
      const noun = total === 1 ? "application" : "applications";
      return total <= to - from + 1 ? `${total} ${noun}` : `${from}–${to} of ${total} ${noun}`;
    },
    none: "No applications match.",
  },

  contributions: {
    search: "Search donor, email, mobile, head or order",
    stats: { paid: "Paid contributions", revenue: "Raised", pending: "Awaiting payment" },
    given: "Made",
    paidOn: "Paid",
    units: (units: number, unit: string | null) => `${units} ${unit ?? "unit"}${units === 1 ? "" : "s"}`,
    wants80g: "80G receipt requested",
    shown: (from: number, to: number, total: number) => {
      const noun = total === 1 ? "contribution" : "contributions";
      return total <= to - from + 1 ? `${total} ${noun}` : `${from}–${to} of ${total} ${noun}`;
    },
    none: "No contributions match.",
  },

  funds: {
    perUnit: (amount: number, unit: string | null) => `₹${amount.toLocaleString("en-IN")} per ${unit ?? "unit"}`,
    anyAmount: "Any amount",
    raised: (paid: number, raised: string) => `${paid} paid · ${raised}`,
    switchLabel: "Accepting contributions",
    on: "Active",
    off: "Inactive",
    stats: { active: "Active heads", paid: "Paid contributions", raised: "Raised" },
    fields: {
      label: "Name",
      note: "Note under the name",
      sortOrder: "Order on the form",
      unitAmount: "Price per unit (₹)",
      unitLabel: "What one unit is",
      maxUnits: "Most units at once",
      kind: "How members give",
      status: "Status",
      minAmount: "Smallest amount (₹)",
      maxAmount: "Largest amount (₹)",
    },
    hints: {
      note: "Shown under the name on the form, e.g. \"₹5,000 per teacher\".",
      minAmount: "Members cannot give less than this.",
      maxAmount: "Larger gifts are sent to the Secretariat instead.",
      unitLabel: "One word, e.g. \"teacher\": the form asks how many teachers to sponsor.",
      kind: "This cannot be changed once the head is added.",
    },
    kindOptions: [
      { value: "amount", label: "Any amount, within limits" },
      { value: "unit", label: "A fixed price per unit (e.g. per teacher sponsored)" },
    ],
    statusOptions: [
      { value: "active", label: "Active: members can pay into it" },
      { value: "suspended", label: "Inactive: shown on the form as suspended" },
    ],
    groups: {
      form: { title: "On the contribution form", lead: "How this head reads where members choose what to give." },
      kind: { title: "How members give", lead: "Whether members choose the amount, or pay a fixed price for each unit." },
      unit: { title: "Price per unit", lead: "Members pay this much for each one they sponsor." },
      amount: { title: "Amount limits", lead: "Members choose how much to give, within these limits." },
    },
    confirmSave: { title: (label: string) => `Save changes to ${label}?`, body: "The contribution form shows these straight away.", yes: "Save changes" },
    confirmOn: {
      title: (label: string) => `Make ${label} active?`,
      body: "Members can choose it and pay into it again.",
      yes: "Make active",
    },
    confirmOff: {
      title: (label: string) => `Make ${label} inactive?`,
      body: "It stays on the contribution form, marked as suspended, but nobody can pay into it until you make it active again.",
      yes: "Make inactive",
    },
    confirmDelete: {
      title: (label: string) => `Delete ${label}?`,
      body: "It is removed from the database and disappears from the contribution form. This cannot be undone.",
      yes: "Delete for good",
    },
    add: "Add head",
    addLong: "Add contribution head",
    newTitle: "New contribution head",
    newLead: "Fill in the details, then add it to the contribution form.",
    cancelAdd: "Cancel",
    adding: "Adding…",
    confirmAdd: {
      title: (label: string) => `Add ${label}?`,
      bodyActive: "It appears on the contribution form straight away, and members can pay into it.",
      bodyInactive: "It appears on the contribution form marked as suspended until you make it active.",
      yes: "Add head",
    },
    busy: "Saving…",
    save: "Save changes",
    saving: "Saving…",
    reset: "Undo changes",
    saved: "Saved. The contribution form now shows your changes.",
    delete: "Delete head",
    deleting: "Deleting…",
    cannotDelete: (total: number, paid: number) => {
      const unpaid = total - paid;
      const parts = [paid > 0 && `${paid} paid`, unpaid > 0 && `${unpaid} not completed`].filter(Boolean).join(", ");
      return `Cannot be deleted: ${total} contribution${total === 1 ? " was" : "s were"} made under this head (${parts}). They are payment records and stay linked to it, so make the head inactive instead.`;
    },
  },

  denied: {
    title: "Admins only",
    body: "The admin panel is for OCA administrators. If you should have access, ask the Secretariat to make your account an admin, then sign in again.",
    cta: "Back to my profile",
  },
};
