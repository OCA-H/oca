import { ROUTES } from "@/app/(view)/common/helper/routes";
import { MEMBERSHIP_CONTENT } from "@/app/(view)/(pv)/membership/content";

export type ProfilePanel = "dashboard" | "account" | "card" | "donor" | "birthdays" | "suggest" | "password";

/**
 * Each panel's address under /sv/profile, so a refresh or a shared link opens the same panel.
 * The dashboard is /sv/profile itself.
 */
export const PROFILE_PANEL_SLUGS: Record<Exclude<ProfilePanel, "dashboard">, string> = {
  account: "account",
  card: "membership-card",
  donor: "donor-pass",
  birthdays: "birthdays",
  suggest: "suggestions",
  password: "change-password",
};

export type ProfileIcon =
  | "dashboard"
  | "user"
  | "card"
  | "ticket"
  | "gift"
  | "people"
  | "briefcase"
  | "rupee"
  | "chat"
  | "lock"
  | "logout"
  | "shield";

/** A menu entry either swaps the panel in place, leaves the members area, or is not ready yet. */
export interface ProfileNavItem {
  label: string;
  icon: ProfileIcon;
  panel?: ProfilePanel;
  href?: string;
  /** Not built yet: shown with a "Soon" tag, and goes nowhere. */
  soon?: boolean;
}

export interface ProfileTile extends ProfileNavItem {
  tone?: "gold" | "blue" | "slate";
  desc: string;
  action: string;
}

export const profileContent = {
  breadcrumb: { homeText: "Home", homeHref: ROUTES.HOME, pageText: "Members" },
  hero: { eyebrow: "Members area" },

  nav: [
    { group: "Overview", items: [{ label: "Dashboard", icon: "dashboard", panel: "dashboard" }] },
    {
      group: "My membership",
      items: [
        { label: "My Account", icon: "user", panel: "account" },
        { label: "e-Membership Card", icon: "card", panel: "card" },
        { label: "Donor Pass", icon: "ticket", panel: "donor", soon: true },
      ],
    },
    {
      group: "Community",
      items: [
        { label: "Today’s Birthday", icon: "gift", panel: "birthdays", soon: true },
        { label: "OCA Directory", icon: "people", soon: true },
        { label: "Internship Program List", icon: "briefcase", soon: true },
      ],
    },
    {
      group: "Give & support",
      items: [
        { label: "Contribute", icon: "rupee", soon: true },
        { label: "Suggestion Box", icon: "chat", panel: "suggest", soon: true },
      ],
    },
    { group: "Account", items: [{ label: "Change Password", icon: "lock", panel: "password" }] },
  ] as { group: string; items: ProfileNavItem[] }[],

  dashboard: {
    title: "Dashboard",
    lead: "A quick look at your membership. Open any card to go deeper.",
    feature: {
      pill: "Upcoming · 18 December 2026",
      title: "OCA Annual Dinner",
      desc: "At the Qutub Golf Course, New Delhi. Passes are for signed-in members, and you are signed in.",
      cta: "Get your pass",
      href: ROUTES.ANNUAL_DINNER_PASSES,
    },
    // The card tile also shows live details; see DashboardPanel. "soon" tiles are shown but go nowhere.
    tiles: [
      { label: "e-Membership Card", icon: "card", panel: "card", desc: "", action: "View card" },
      { label: "Donor Pass", icon: "ticket", panel: "donor", tone: "gold", desc: "Unlocks partner offers.", action: "Take your pass", soon: true },
      { label: "My Account", icon: "user", panel: "account", desc: "Keep your phone and address current.", action: "Update details" },
      { label: "Today’s Birthday", icon: "gift", panel: "birthdays", tone: "blue", desc: "Send wishes to fellow Columbans.", action: "Send wishes", soon: true },
      { label: "OCA Directory", icon: "people", tone: "blue", desc: "Find batchmates by batch, city or name.", action: "Search the directory", soon: true },
      { label: "Internship Program List", icon: "briefcase", tone: "blue", desc: "Short placements with Columban-run firms.", action: "Browse placements", soon: true },
      { label: "Contribute", icon: "rupee", tone: "gold", desc: "Back the School and your fellow Columbans.", action: "Contribute", soon: true },
      { label: "Suggestion Box", icon: "chat", panel: "suggest", tone: "gold", desc: "Tell the Secretariat what to improve.", action: "Share an idea", soon: true },
      { label: "Change Password", icon: "lock", panel: "password", tone: "slate", desc: "Keep your member login secure.", action: "Change password" },
    ] as ProfileTile[],
  },

  /** Shown to admins only, in the menu and on the dashboard. */
  admin: {
    nav: { group: "Administration", items: [{ label: "Admin Panel", icon: "shield", href: ROUTES.ADMIN }] } as {
      group: string;
      items: ProfileNavItem[];
    },
    tile: {
      label: "Admin Panel",
      icon: "shield",
      href: ROUTES.ADMIN,
      tone: "gold",
      desc: "Update the website’s images and text.",
      action: "Manage the website",
    } as ProfileTile,
  },

  /** Shown in place of a panel that is not built yet, if its address is opened directly. */
  comingSoon: {
    tag: "Soon",
    badge: "Coming soon",
    title: "Coming soon",
    lead: "We are still building this part of the members area. It will be ready here soon.",
    back: "Back to dashboard",
  },

  account: {
    title: "My Account",
    lead: "Keep your details up to date so batchmates and the Secretariat can reach you.",
    success: "Your details have been saved.",
    successNote: "Thank you for keeping them current.",
    batchHint: "The year you passed out of St. Columba’s.",
    lockedHint: {
      email: "You signed in with this email, so it can’t be changed here. Write to the Secretariat if it needs correcting.",
      mobile: "You signed in with this number, so it can’t be changed here. Write to the Secretariat if it needs correcting.",
    },
    mobileHint: "Include the country code if you live outside India.",
    dobHint: "So batchmates can wish you on the day.",
    titles: MEMBERSHIP_CONTENT.titles,
    batches: MEMBERSHIP_CONTENT.batches,
    countries: MEMBERSHIP_CONTENT.countries,
  },

  card: {
    title: "e-Membership Card",
    lead: "Your digital membership card.",
    org: "Old Columbans Association",
    school: "St. Columba’s School, New Delhi",
    // Shown under "Valid" when the membership type has no fixed term on record.
    activeLabel: "Active",
    labels: {
      member: "Member",
      membership: "Membership",
      memberId: "Member ID",
      batch: "Batch",
      house: "House",
      memberSince: "Member since",
      order: "Order reference",
      paidVia: "Paid via",
      amount: "Amount paid",
      valid: "Valid",
    },
    notValid: "Not active",
    notValidNote: "This membership is not active right now, so the card cannot be used. Please write to the Secretariat.",
    loadError: "We could not load your membership card.",
    retry: "Try again",
  },

  donor: {
    title: "Donor Pass",
    lead: "Exclusive offers for members who hold a donor pass.",
    statusLabel: "Your status",
    status: "Donor pass not taken yet",
    tileBadge: "Not taken yet",
    cta: "Take your donor pass",
    href: ROUTES.DONATION_GIVE_FORM,
    partnersLead: "Donor-pass holders can use exclusive offers from the Association’s partners.",
    partners: ["MakeMyTrip", "SpiceJet", "Samsung"],
  },

  birthdays: {
    title: "Today’s Birthday",
    lead: "Send a wish to a fellow Columban.",
    people: [
      { name: "Rohan Kapoor", batch: "1998", city: "Mumbai" },
      { name: "Vikram Singh", batch: "1989", city: "Dubai" },
      { name: "Anil Verma", batch: "2004", city: "New Delhi" },
    ],
  },

  suggest: {
    title: "Suggestion Box",
    lead: "Your ideas help shape the Association. The Secretariat reads every one.",
    success: "Thank you — your suggestion has been sent.",
    again: "Send another",
  },

  password: {
    title: "Change Password",
    lead: "Choose a new password for your member login: at least 8 characters, different from your current one.",
    success: "Your password has been updated.",
    successNote: "Use the new one the next time you sign in.",
    mismatch: "The two new passwords do not match.",
  },

  help: {
    title: "Need a hand?",
    desc: "The Secretariat can help with your membership, payments and details.",
    phone: "011-23748666",
    phoneHref: "tel:01123748666",
    email: "info@oldcolumban.net",
  },

  photo: {
    types: /^image\/(png|jpe?g|webp)$/i,
    // Matches the server's limit (PROFILE_PHOTO_RULES); checked here first to save a wasted upload.
    maxBytes: 10 * 1024 * 1024,
    updated: "Photo updated.",
    uploading: "Uploading your photo…",
    badType: "Please choose a JPG, PNG or WebP image.",
    tooBig: "That image is over 10 MB. Please choose a smaller one.",
    uploadFailed: "We could not save your photo. Please try again.",
  },
};

/** Panels marked "soon" in the menu: their address shows the Coming soon panel instead. */
export const SOON_PANELS = new Set<ProfilePanel>(
  profileContent.nav.flatMap(({ items }) => items).filter((item) => item.soon && item.panel).map((item) => item.panel!)
);
