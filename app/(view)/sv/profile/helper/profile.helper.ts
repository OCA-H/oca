import type { MemberProfile, ProfileUpdate } from "../services";

export const profileHelper = {
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
