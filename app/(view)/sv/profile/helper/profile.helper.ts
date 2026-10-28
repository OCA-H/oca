import { ROUTES } from "@/app/(view)/common/helper/routes";
import { PROFILE_PANEL_SLUGS, type ProfilePanel } from "../content";
import type { MemberProfile, ProfileUpdate } from "../services";

const PANEL_BY_SLUG = Object.fromEntries(
  Object.entries(PROFILE_PANEL_SLUGS).map(([panel, slug]) => [slug, panel as ProfilePanel])
);

export const profileHelper = {
  /** "account" → "/sv/profile/account"; the dashboard is "/sv/profile". */
  panelPath: (panel: ProfilePanel): string =>
    panel === "dashboard" ? ROUTES.PROFILE : `${ROUTES.PROFILE}/${PROFILE_PANEL_SLUGS[panel]}`,

  /** The panel a /sv/profile/... address points at, or null when it is not one of ours. */
  panelFromSlug: (slug: string | undefined): ProfilePanel | null =>
    slug === undefined ? "dashboard" : (PANEL_BY_SLUG[slug] ?? null),

  /** The panel for the current pathname, falling back to the dashboard. */
  panelFromPath: (pathname: string): ProfilePanel => {
    const rest = pathname.replace(/\/+$/, "").slice(ROUTES.PROFILE.length).replace(/^\//, "");
    return profileHelper.panelFromSlug(rest || undefined) ?? "dashboard";
  },

  getInitials: (name: string): string =>
    name
      .split(" ")
      .filter((part) => part && !part.endsWith("."))
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),

  /** "Aryan Mehra": the name without its title, for greetings and the card. */
  displayName: (profile: MemberProfile): string =>
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.fullName,

  /** "Life Member · Batch of 1995" */
  membershipLine: (profile: MemberProfile): string =>
    [profile.membershipType, profile.batchYear && `Batch of ${profile.batchYear}`].filter(Boolean).join(" · "),

  toForm: (profile: MemberProfile): ProfileUpdate => ({
    title: profile.title,
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    email: profile.email,
    mobile: profile.mobile,
    batchYear: profile.batchYear ?? "",
    address: { ...profile.address },
  }),

  /** True when the form differs from what is saved, so Save and Discard have something to do. */
  isDirty: (form: ProfileUpdate, saved: ProfileUpdate): boolean => JSON.stringify(form) !== JSON.stringify(saved),
};
