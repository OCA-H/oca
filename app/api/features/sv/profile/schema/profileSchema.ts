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
  avatarUrl: string | null;
  address: ProfileAddress;
}

export interface ProfileUpdate {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: ProfileAddress;
}
