import { ROUTES } from "@/app/(view)/common/helper/routes";
import { MEMBERSHIP_CONTENT } from "@/app/(view)/(pv)/membership/content";

export type ProfilePanel = "dashboard" | "account" | "card" | "donor" | "birthdays" | "suggest" | "password";

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
  | "logout";

/** A menu entry either swaps the panel in place or leaves the members area. */
export interface ProfileNavItem {
  label: string;
  icon: ProfileIcon;
  panel?: ProfilePanel;
  href?: string;
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
        { label: "Donor Pass", icon: "ticket", panel: "donor" },
      ],
    },
    {
      group: "Community",
      items: [
        { label: "Today’s Birthday", icon: "gift", panel: "birthdays" },
        { label: "OCA Directory", icon: "people", href: ROUTES.HOME_CONNECT },
        { label: "Internship Program List", icon: "briefcase", href: ROUTES.HOME_CONNECT },
      ],
    },
    {
      group: "Give & support",
      items: [
        { label: "Contribute", icon: "rupee", href: ROUTES.DONATION },
        { label: "Suggestion Box", icon: "chat", panel: "suggest" },
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
    // The card and birthday tiles also show live details; see DashboardPanel.
    tiles: [
      { label: "e-Membership Card", icon: "card", panel: "card", desc: "", action: "View card" },
      { label: "Donor Pass", icon: "ticket", panel: "donor", tone: "gold", desc: "Unlocks partner offers.", action: "Take your pass" },
      { label: "My Account", icon: "user", panel: "account", desc: "Keep your phone and address current.", action: "Update details" },
      { label: "Today’s Birthday", icon: "gift", panel: "birthdays", tone: "blue", desc: "", action: "Send wishes" },
      { label: "OCA Directory", icon: "people", href: ROUTES.HOME_CONNECT, tone: "blue", desc: "Find batchmates by batch, city or name.", action: "Search the directory" },
      { label: "Internship Program List", icon: "briefcase", href: ROUTES.HOME_CONNECT, tone: "blue", desc: "Short placements with Columban-run firms.", action: "Browse placements" },
      { label: "Contribute", icon: "rupee", href: ROUTES.DONATION, tone: "gold", desc: "Back the School and your fellow Columbans.", action: "Contribute" },
      { label: "Suggestion Box", icon: "chat", panel: "suggest", tone: "gold", desc: "Tell the Secretariat what to improve.", action: "Share an idea" },
      { label: "Change Password", icon: "lock", panel: "password", tone: "slate", desc: "Keep your member login secure.", action: "Change password" },
    ] as ProfileTile[],
  },

  account: {
    title: "My Account",
    lead: "Keep your details up to date so batchmates and the Secretariat can reach you.",
    success: "Your details have been saved.",
    successNote: "Thank you for keeping them current.",
    batchHint: "Batch is checked against School records. Write to the Secretariat if it needs correcting.",
    titles: MEMBERSHIP_CONTENT.titles,
    batches: MEMBERSHIP_CONTENT.batches,
    countries: MEMBERSHIP_CONTENT.countries,
  },

  card: {
    title: "e-Membership Card",
    lead: "Your digital membership card.",
    org: "Old Columbans Association",
    school: "St. Columba’s School, New Delhi",
    validity: "For life",
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
    lead: "Choose a new password for your member login.",
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
    maxBytes: 5 * 1024 * 1024,
    updated: "Photo updated.",
    badType: "Please choose a JPG, PNG or WebP image.",
    tooBig: "That image is over 5 MB. Please choose a smaller one.",
    unreadable: "Sorry, that image could not be read. Please try another.",
  },
};
