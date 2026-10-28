import { apiRequest } from "@/app/(view)/common/services/api.service";

export interface ProfileAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Contact fields the member signed in with, which stay read-only in My Account. */
export type LockedField = "email" | "mobile";

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
  lockedFields: LockedField[];
}

export type ProfileUpdate = Pick<
  MemberProfile,
  "title" | "firstName" | "middleName" | "lastName" | "email" | "mobile" | "address"
> & { batchYear: string };

export const profileService = {
  getProfile: async (): Promise<MemberProfile> => {
    const json = await apiRequest<{ data: MemberProfile }>("/api/sv/profile");
    return json.data;
  },

  updateProfile: async (update: ProfileUpdate): Promise<MemberProfile> => {
    const json = await apiRequest<{ data: MemberProfile }>("/api/sv/profile", { method: "PATCH", body: update });
    return json.data;
  },

  changePassword: async (current: string, next: string): Promise<void> => {
    await apiRequest("/api/sv/profile/password", { method: "POST", body: { current, new: next } });
  },

  sendSuggestion: async (subject: string, message: string): Promise<void> => {
    await apiRequest("/api/sv/profile/suggestion", { method: "POST", body: { subject, message } });
  },

  signOut: async (): Promise<void> => {
    await apiRequest("/api/auth/sign-out", { method: "POST" }).catch(() => undefined);
  },
};
