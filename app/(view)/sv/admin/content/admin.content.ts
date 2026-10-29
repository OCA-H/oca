import { ROUTES } from "@/app/(view)/common/helper/routes";
import { SECTION_SPECS, type SectionSpec, type SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

/** Panels that show records from the database rather than editing a section of the site. */
export type RecordPanel = "passes" | "bookings" | "funds";

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
  | "shield"
  | "people"
  | "home"
  | "info"
  | "layers"
  | "moon"
  | "sun"
  | "ticket"
  | "mail"
  | "phone"
  | "rupee";

export const SECTION_ICONS: Record<SiteSectionKey, AdminIconName> = {
  "home.events": "calendar",
  "home.notices": "megaphone",
  "home.spotlight": "star",
  "home.hangout": "camera",
  "home.social": "heart",
  "about.committee": "people",
  "events.dinner": "moon",
  "events.lunch": "sun",
  "membership.fee": "rupee",
  "settings.emails": "mail",
  "settings.contact": "phone",
};

/** The record panels, in menu order, under their menu group. Each has its own address, e.g. /sv/admin/passes. */
export const RECORD_PANELS: Record<RecordPanel, { group: string; label: string; description: string; icon: AdminIconName }> = {
  passes: {
    group: "Passes",
    label: "Passes & seats",
    description: "Prices, seats left and which Annual Dinner passes are open for booking.",
    icon: "ticket",
  },
  bookings: {
    group: "Passes",
    label: "Pass bookings",
    description: "Every Annual Dinner pass booking, with the member's details and payment.",
    icon: "people",
  },
  funds: {
    group: "Contributions",
    label: "Contribution heads",
    description: "What members can contribute to: change the wording, turn a head on or off, or delete it.",
    icon: "heart",
  },
};

/** The record panels' menu groups, in order, with their panels. */
export const RECORD_GROUPS: { group: string; icon: AdminIconName; panels: RecordPanel[] }[] = [
  { group: "Passes", icon: "ticket", panels: ["passes", "bookings"] },
  { group: "Contributions", icon: "heart", panels: ["funds"] },
];

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
      // Pages whose content is still written into the code; they become editable one by one.
      group: "Other pages",
      icon: "layers",
      collapsible: true,
      items: [
        { label: "Executive Committee", icon: "page", soon: true },
        { label: "Sports", icon: "page", soon: true },
      ],
    },
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
  },

  image: {
    upload: "Upload image",
    replace: "Replace image",
    uploading: "Uploading…",
    types: /^image\/(png|jpe?g|webp)$/i,
    accept: "image/png,image/jpeg,image/webp",
    // Matches the server's limit (SITE_IMAGE_RULES); checked here first to save a wasted upload.
    maxBytes: 10 * 1024 * 1024,
    badType: "Please choose a JPG, PNG or WebP image.",
    tooBig: "That image is over 10 MB. Please choose a smaller one.",
    failed: "We could not upload that image. Please try again.",
    none: "No image",
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
      card: { title: "Shown on the pass card", lead: "How this pass reads on the Annual Dinner page." },
    },
    confirm: {
      title: (label: string) => `Save changes to ${label}?`,
      body: "The Annual Dinner page shows these straight away.",
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
      availableQuantity: "Goes down by one with every paid booking.",
      statusNote: "Shown on the pass card. A note such as \"42 left\" keeps counting down by itself.",
    },
    save: "Save pass",
    saving: "Saving…",
    reset: "Undo changes",
    saved: "Saved. The Annual Dinner page now shows your changes.",
  },

  bookings: {
    filters: [
      { value: "", label: "All" },
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "cancelled", label: "Cancelled" },
    ],
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
    shown: (shown: number, total: number) => {
      const noun = total === 1 ? "booking" : "bookings";
      return shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;
    },
    none: "No bookings match.",
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
      maxUnits: "Most units at once",
    },
    hints: { note: "Shown under the name on the form, e.g. \"₹5,000 per teacher\"." },
    groups: {
      form: { title: "On the contribution form", lead: "How this head reads where members choose what to give." },
      unit: { title: "Price per teacher", lead: "Members pay this much for each one they sponsor." },
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
