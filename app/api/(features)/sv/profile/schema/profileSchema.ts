// The profile reuses the users table: name parts and address live in users.metadata,
// in the same shape the membership checkout writes them.

export interface ProfileAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Contact fields that can be locked because the member signs in with them. */
export type LockedField = "email" | "mobile";

/** What the members area shows and edits. */
export interface MemberProfile {
  id: number;
  memberId: string;
  fullName: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  batchYear: string | null;
  house: string | null;
  membershipType: string;
  status: string;
  /** "member" or "admin"; admins also get the admin panel. */
  role: string;
  avatarUrl: string | null;
  address: ProfileAddress;
  /** Fields the member cannot change here, because this session signed in with them. */
  lockedFields: LockedField[];
}

/** What the e-Membership Card shows. */
export interface MembershipCard {
  memberId: string;
  /** "Aryan Mehra": the name without its title. */
  name: string;
  membershipType: string;
  batchYear: string | null;
  house: string | null;
  /** "active" while the member can sign in; anything else shows the card as not valid. */
  status: string;
  /** "For life" for life and honorary members; null when the type has no fixed term on record. */
  validity: string | null;
  /** When the membership was paid for, else when the account was made. ISO date. */
  memberSince: string;
  /** The paid membership order, when the member joined through the online form. */
  payment: {
    orderId: string;
    amount: number;
    currency: string;
    paidAt: string | null;
    paymentMode: string | null;
  } | null;
}

export interface ProfileUpdate {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  batchYear: string;
  address: ProfileAddress;
}
