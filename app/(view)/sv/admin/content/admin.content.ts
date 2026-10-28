import { ROUTES } from "@/app/(view)/common/helper/routes";
import { SECTION_SPECS, type SectionSpec, type SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

/** The open panel: the dashboard, or the editor for one section (its key, e.g. "home.events"). */
export type AdminPanel = "dashboard" | SiteSectionKey;

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
  | "sun";

export const SECTION_ICONS: Record<SiteSectionKey, AdminIconName> = {
  "home.events": "calendar",
  "home.notices": "megaphone",
  "home.spotlight": "star",
  "home.hangout": "camera",
  "home.social": "heart",
  "about.committee": "people",
  "events.dinner": "moon",
  "events.lunch": "sun",
};

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
    {
      // Pages whose content is still written into the code; they become editable one by one.
      group: "Other pages",
      icon: "layers",
      collapsible: true,
      items: [
        { label: "Executive Committee", icon: "page", soon: true },
        { label: "Sports", icon: "page", soon: true },
        { label: "Membership", icon: "page", soon: true },
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

  denied: {
    title: "Admins only",
    body: "The admin panel is for OCA administrators. If you should have access, ask the Secretariat to make your account an admin, then sign in again.",
    cta: "Back to my profile",
  },
};
